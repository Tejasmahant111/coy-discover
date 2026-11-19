import { SEED_PROFILES, PROFILES_BY_ID } from './seed.js';
import { toPublicProfile } from './publicProfile.js';
import { readState, transaction } from './db.js';

export const ACTIONS = Object.freeze(['like', 'pass']);

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/**
 * Profiles the user has not swiped on yet, in a fixed order.
 *
 * Privacy: the order is the seed order and never depends on `likesYou`.
 * Sorting likers first (a common "boost matches" trick) would let a user
 * infer who liked them just from card position.
 */
export async function getFeed({ limit } = {}) {
  const state = await readState();
  const unseen = SEED_PROFILES.filter((p) => !state.swipes[p.id]).map(toPublicProfile);
  return typeof limit === 'number' ? unseen.slice(0, limit) : unseen;
}

/**
 * Record a like or pass. Returns `{ matched, match? }`.
 *
 * - A match is created only when the user likes someone who already liked them.
 * - A pass never reveals anything: the response is identical whether or not
 *   that person liked the user.
 * - Swipes are final (same rule Coy uses for adding crushes): you can't undo a
 *   pass and re-like to probe who likes you. Repeating the SAME swipe is
 *   idempotent (safe for network retries); changing it is a 409.
 */
export async function recordSwipe({ profileId, action }) {
  if (typeof profileId !== 'string' || profileId.length === 0) {
    throw new ApiError(400, 'INVALID_PROFILE_ID', '`profileId` must be a non-empty string.');
  }
  if (!ACTIONS.includes(action)) {
    throw new ApiError(400, 'INVALID_ACTION', '`action` must be "like" or "pass".');
  }
  const profile = PROFILES_BY_ID.get(profileId);
  if (!profile) {
    throw new ApiError(404, 'PROFILE_NOT_FOUND', `No profile with id "${profileId}".`);
  }

  return transaction((state) => {
    const existing = state.swipes[profileId];
    if (existing) {
      if (existing.action !== action) {
        throw new ApiError(409, 'ALREADY_SWIPED', `You already chose "${existing.action}" for this profile.`);
      }
      return { state: null, result: buildSwipeResult(profile, state.matches[profileId]) };
    }

    const at = new Date().toISOString();
    state.swipes[profileId] = { action, at };
    if (action === 'like' && profile.likesYou === true) {
      state.matches[profileId] = { at };
    }
    return { state, result: buildSwipeResult(profile, state.matches[profileId]) };
  });
}

function buildSwipeResult(profile, matchRecord) {
  if (!matchRecord) return { matched: false };
  return {
    matched: true,
    match: { profile: toPublicProfile(profile), matchedAt: matchRecord.at },
  };
}

/** Mutual matches only, newest first. */
export async function getMatches() {
  const state = await readState();
  return Object.entries(state.matches)
    .filter(([id]) => PROFILES_BY_ID.has(id))
    .map(([id, rec]) => ({ profile: toPublicProfile(PROFILES_BY_ID.get(id)), matchedAt: rec.at }))
    .sort((a, b) => (a.matchedAt < b.matchedAt ? 1 : a.matchedAt > b.matchedAt ? -1 : 0));
}
