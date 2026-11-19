import { ApiError } from './discover.js';

const NO_STORE = { 'Cache-Control': 'no-store' };

export function json(body, status = 200) {
  return Response.json(body, { status, headers: NO_STORE });
}

/** Runs a handler and turns thrown errors into consistent JSON responses. */
export async function handle(fn) {
  try {
    return json(await fn());
  } catch (err) {
    if (err instanceof ApiError) {
      return json({ error: { code: err.code, message: err.message } }, err.status);
    }
    console.error('[coy-discover] unexpected error', err);
    return json({ error: { code: 'INTERNAL', message: 'Something went wrong.' } }, 500);
  }
}

export async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, 'INVALID_JSON', 'Request body must be valid JSON.');
  }
}
