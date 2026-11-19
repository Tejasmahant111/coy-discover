import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

import { useTempDb } from './helpers.js';
import { SEED_PROFILES } from '../lib/seed.js';
import { PUBLIC_PROFILE_FIELDS, toPublicProfile } from '../lib/publicProfile.js';
import { getFeed, recordSwipe, getMatches, ApiError } from '../lib/discover.js';
import { readState, resetState } from '../lib/db.js';

const likers = SEED_PROFILES.filter((p) => p.likesYou);
const nonLikers = SEED_PROFILES.filter((p) => !p.likesYou);

test('seed data meets the brief', () => {
  assert.ok(SEED_PROFILES.length >= 30, 'at least 30 profiles');
  assert.ok(likers.length >= 3, 'some profiles already like the user');
  const ids = new Set(SEED_PROFILES.map((p) => p.id));
  assert.equal(ids.size, SEED_PROFILES.length, 'ids are unique');
  for (const p of SEED_PROFILES) {
    for (const field of ['name', 'age', 'photo', 'bio', 'city', 'interests']) {
      assert.ok(p[field], `${p.id} has ${field}`);
    }
    assert.ok(p.interests.length > 0);
    assert.equal(typeof p.likesYou, 'boolean');
  }
});

test('toPublicProfile is an allow-list and strips private fields', () => {
  const pub = toPublicProfile({ ...SEED_PROFILES[0], likesYou: true, phone: '+91…', secret: 1 });
  assert.deepEqual(Object.keys(pub).sort(), [...PUBLIC_PROFILE_FIELDS].sort());
  assert.equal('likesYou' in pub, false);
  assert.equal('phone' in pub, false);
});

test('feed starts with every profile, in seed order, with no private data', async (t) => {
  useTempDb(t);
  const feed = await getFeed();
  assert.deepEqual(feed.map((p) => p.id), SEED_PROFILES.map((p) => p.id));
  for (const p of feed) assert.equal('likesYou' in p, false);
});

test('feed order does not depend on who liked the user', async (t) => {
  useTempDb(t);
  const feed = await getFeed();
  // If likers were boosted they would cluster at the top.
  const firstLikerIndex = feed.findIndex((p) => likers.some((l) => l.id === p.id));
  assert.ok(firstLikerIndex > 0, 'first card is not automatically a liker');
  const topN = feed.slice(0, likers.length).filter((p) => likers.some((l) => l.id === p.id));
  assert.ok(topN.length < likers.length, 'likers are not all at the top');
});

test('feed honours limit', async (t) => {
  useTempDb(t);
  assert.equal((await getFeed({ limit: 5 })).length, 5);
});

test('liking someone who liked you creates a match', async (t) => {
  useTempDb(t);
  const target = likers[0];
  const res = await recordSwipe({ profileId: target.id, action: 'like' });
  assert.equal(res.matched, true);
  assert.equal(res.match.profile.id, target.id);
  assert.equal('likesYou' in res.match.profile, false);
  assert.ok(!Number.isNaN(Date.parse(res.match.matchedAt)));

  const matches = await getMatches();
  assert.deepEqual(matches.map((m) => m.profile.id), [target.id]);
});

test('liking someone who has not liked you is not a match', async (t) => {
  useTempDb(t);
  const res = await recordSwipe({ profileId: nonLikers[0].id, action: 'like' });
  assert.deepEqual(res, { matched: false });
  assert.deepEqual(await getMatches(), []);
});

test('passing reveals nothing: identical response for likers and non-likers', async (t) => {
  useTempDb(t);
  const a = await recordSwipe({ profileId: likers[0].id, action: 'pass' });
  const b = await recordSwipe({ profileId: nonLikers[0].id, action: 'pass' });
  assert.deepEqual(a, { matched: false });
  assert.deepEqual(a, b);
  assert.deepEqual(await getMatches(), []);
});

test('a swiped profile never appears in the feed again', async (t) => {
  useTempDb(t);
  await recordSwipe({ profileId: 'p01', action: 'pass' });
  await recordSwipe({ profileId: 'p02', action: 'like' });
  const ids = (await getFeed()).map((p) => p.id);
  assert.equal(ids.includes('p01'), false);
  assert.equal(ids.includes('p02'), false);
  assert.equal(ids.length, SEED_PROFILES.length - 2);
});

test('swipes are final: changing a swipe is rejected (no pass-then-like probing)', async (t) => {
  useTempDb(t);
  await recordSwipe({ profileId: likers[0].id, action: 'pass' });
  await assert.rejects(
    recordSwipe({ profileId: likers[0].id, action: 'like' }),
    (err) => err instanceof ApiError && err.status === 409 && err.code === 'ALREADY_SWIPED',
  );
  assert.deepEqual(await getMatches(), []);
});

test('repeating the same swipe is idempotent (safe retries)', async (t) => {
  useTempDb(t);
  const first = await recordSwipe({ profileId: likers[1].id, action: 'like' });
  const again = await recordSwipe({ profileId: likers[1].id, action: 'like' });
  assert.deepEqual(again, first);
  assert.equal((await getMatches()).length, 1);
});

test('validates input', async (t) => {
  useTempDb(t);
  const cases = [
    [{ profileId: 'p01', action: 'superlike' }, 400, 'INVALID_ACTION'],
    [{ profileId: '', action: 'like' }, 400, 'INVALID_PROFILE_ID'],
    [{ profileId: 42, action: 'like' }, 400, 'INVALID_PROFILE_ID'],
    [{ profileId: 'nope', action: 'like' }, 404, 'PROFILE_NOT_FOUND'],
  ];
  for (const [input, status, code] of cases) {
    await assert.rejects(recordSwipe(input), (err) => err.status === status && err.code === code);
  }
  assert.deepEqual((await readState()).swipes, {});
});

test('state persists to disk (survives a reload)', async (t) => {
  const file = useTempDb(t);
  await recordSwipe({ profileId: likers[0].id, action: 'like' });
  await recordSwipe({ profileId: 'p01', action: 'pass' });
  const onDisk = JSON.parse(readFileSync(file, 'utf8'));
  assert.equal(onDisk.swipes[likers[0].id].action, 'like');
  assert.equal(onDisk.swipes.p01.action, 'pass');
  assert.ok(onDisk.matches[likers[0].id]);
});

test('concurrent swipes are all saved (no lost writes)', async (t) => {
  useTempDb(t);
  const results = await Promise.all(
    SEED_PROFILES.map((p) => recordSwipe({ profileId: p.id, action: 'like' })),
  );
  assert.equal(Object.keys((await readState()).swipes).length, SEED_PROFILES.length);
  assert.equal(results.filter((r) => r.matched).length, likers.length);
  assert.equal((await getMatches()).length, likers.length);
  assert.deepEqual(await getFeed(), []);
});

test('matches are newest first', async (t) => {
  useTempDb(t);
  await recordSwipe({ profileId: likers[0].id, action: 'like' });
  await new Promise((r) => setTimeout(r, 5));
  await recordSwipe({ profileId: likers[1].id, action: 'like' });
  const ids = (await getMatches()).map((m) => m.profile.id);
  assert.deepEqual(ids, [likers[1].id, likers[0].id]);
});

test('a corrupt data file is recovered instead of crashing', async (t) => {
  const file = useTempDb(t);
  writeFileSync(file, '{ not json');
  assert.equal((await getFeed()).length, SEED_PROFILES.length);
});

test('reset clears swipes and matches', async (t) => {
  useTempDb(t);
  await recordSwipe({ profileId: likers[0].id, action: 'like' });
  await resetState();
  assert.equal((await getFeed()).length, SEED_PROFILES.length);
  assert.deepEqual(await getMatches(), []);
});
