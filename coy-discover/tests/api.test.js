// Exercises the real Next.js route handlers (they are plain Web Request → Response functions).
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { useTempDb } from './helpers.js';
import { SEED_PROFILES } from '../lib/seed.js';
import { GET as getFeed } from '../app/feed/route.js';
import { POST as postSwipe } from '../app/swipe/route.js';
import { GET as getMatches } from '../app/matches/route.js';
import { POST as postReset } from '../app/reset/route.js';

const BASE = 'http://localhost';
const liker = SEED_PROFILES.find((p) => p.likesYou);
const nonLiker = SEED_PROFILES.find((p) => !p.likesYou);

const swipe = (body) =>
  postSwipe(
    new Request(`${BASE}/swipe`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );

test('GET /feed returns unswiped profiles without private fields', async (t) => {
  useTempDb(t);
  const res = await getFeed(new Request(`${BASE}/feed`));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('cache-control'), 'no-store');
  const text = await res.text();
  assert.equal(text.includes('likesYou'), false, 'never serialises likesYou');
  assert.equal(JSON.parse(text).profiles.length, SEED_PROFILES.length);
});

test('GET /feed?limit validates', async (t) => {
  useTempDb(t);
  assert.equal((await getFeed(new Request(`${BASE}/feed?limit=3`))).status, 200);
  assert.equal((await getFeed(new Request(`${BASE}/feed?limit=0`))).status, 400);
  assert.equal((await getFeed(new Request(`${BASE}/feed?limit=abc`))).status, 400);
});

test('POST /swipe like → match, then GET /matches lists it', async (t) => {
  useTempDb(t);
  const res = await swipe({ profileId: liker.id, action: 'like' });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.matched, true);
  assert.equal(body.match.profile.id, liker.id);

  const matches = await (await getMatches()).json();
  assert.deepEqual(matches.matches.map((m) => m.profile.id), [liker.id]);

  const feed = await (await getFeed(new Request(`${BASE}/feed`))).json();
  assert.equal(feed.profiles.some((p) => p.id === liker.id), false);
});

test('POST /swipe pass on a liker looks exactly like a pass on anyone else', async (t) => {
  useTempDb(t);
  const a = await (await swipe({ profileId: liker.id, action: 'pass' })).text();
  const b = await (await swipe({ profileId: nonLiker.id, action: 'pass' })).text();
  assert.equal(a, b);
  assert.deepEqual((await (await getMatches()).json()).matches, []);
});

test('POST /swipe error responses', async (t) => {
  useTempDb(t);
  const bad = await swipe('{oops');
  assert.equal(bad.status, 400);
  assert.equal((await bad.json()).error.code, 'INVALID_JSON');

  assert.equal((await swipe(null)).status, 400);
  assert.equal((await swipe({ profileId: 'p01', action: 'maybe' })).status, 400);
  assert.equal((await swipe({ profileId: 'zzz', action: 'like' })).status, 404);

  assert.equal((await swipe({ profileId: 'p01', action: 'pass' })).status, 200);
  const conflict = await swipe({ profileId: 'p01', action: 'like' });
  assert.equal(conflict.status, 409);
  assert.equal((await conflict.json()).error.code, 'ALREADY_SWIPED');
});

test('no endpoint ever leaks who liked the user', async (t) => {
  useTempDb(t);
  const bodies = [];
  bodies.push(await (await getFeed(new Request(`${BASE}/feed`))).text());
  for (const p of SEED_PROFILES) {
    bodies.push(await (await swipe({ profileId: p.id, action: p.likesYou ? 'pass' : 'like' })).text());
  }
  bodies.push(await (await getMatches()).text());
  for (const b of bodies) assert.equal(b.includes('likesYou'), false);
  // Passed on every liker and liked every non-liker → zero matches, zero hints.
  assert.deepEqual(JSON.parse(bodies.at(-1)).matches, []);
});

test('POST /reset restores the full feed', async (t) => {
  useTempDb(t);
  await swipe({ profileId: 'p01', action: 'pass' });
  assert.equal((await postReset()).status, 200);
  const feed = await (await getFeed(new Request(`${BASE}/feed`))).json();
  assert.equal(feed.profiles.length, SEED_PROFILES.length);
});
