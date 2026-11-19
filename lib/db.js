import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Tiny JSON-file store for the logged-in user's state.
 *
 * Profiles are static seed data (lib/seed.js). The only thing that changes is
 * what the user has done, so that is all we persist:
 *
 *   {
 *     "version": 1,
 *     "swipes":  { "<profileId>": { "action": "like" | "pass", "at": ISO } },
 *     "matches": { "<profileId>": { "at": ISO } }
 *   }
 *
 * Writes are serialised through an in-process lock and written atomically
 * (temp file + rename), so concurrent swipes can't clobber each other and a
 * crash mid-write can't leave a half-written file behind.
 */

const SCHEMA_VERSION = 1;

export function dataFilePath() {
  if (process.env.COY_DATA_FILE) return process.env.COY_DATA_FILE;
  // Serverless hosts (e.g. Vercel) only allow writes to /tmp.
  if (process.env.VERCEL) return '/tmp/coy-discover/db.json';
  return path.join(process.cwd(), 'data', 'db.json');
}

export function emptyState() {
  return { version: SCHEMA_VERSION, swipes: {}, matches: {} };
}

function isValidState(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    value.swipes !== null &&
    typeof value.swipes === 'object' &&
    value.matches !== null &&
    typeof value.matches === 'object'
  );
}

export async function readState() {
  const file = dataFilePath();
  let raw;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return emptyState();
    throw err;
  }
  try {
    const parsed = JSON.parse(raw);
    if (isValidState(parsed)) return parsed;
  } catch {
    // fall through
  }
  // Corrupt file: keep a copy for debugging and start clean rather than crash.
  await fs.rename(file, `${file}.corrupt-${Date.now()}`).catch(() => {});
  console.warn(`[coy-discover] ${file} was unreadable; starting with an empty state.`);
  return emptyState();
}

async function writeState(state) {
  const file = dataFilePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(tmp, JSON.stringify(state, null, 2));
  await fs.rename(tmp, file);
}

// Shared across Next.js hot reloads so there is only ever one lock per process.
const LOCK_KEY = Symbol.for('coy-discover.db-lock');
if (!globalThis[LOCK_KEY]) globalThis[LOCK_KEY] = Promise.resolve();

function withLock(fn) {
  const run = globalThis[LOCK_KEY].then(fn, fn);
  // Keep the chain alive even if this task fails.
  globalThis[LOCK_KEY] = run.catch(() => {});
  return run;
}

/**
 * Read-modify-write under the lock. `mutate` receives the current state and
 * returns `{ state, result }`; `state` is persisted only if it is returned.
 */
export function transaction(mutate) {
  return withLock(async () => {
    const current = await readState();
    const { state, result } = await mutate(current);
    if (state) await writeState(state);
    return result;
  });
}

export function resetState() {
  return withLock(() => writeState(emptyState()));
}
