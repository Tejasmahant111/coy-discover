import { getFeed, ApiError } from '../../lib/discover.js';
import { handle } from '../../lib/http.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** GET /feed[?limit=n] → { profiles: PublicProfile[] } — profiles not yet swiped on. */
export async function GET(request) {
  return handle(async () => {
    const raw = new URL(request.url).searchParams.get('limit');
    let limit;
    if (raw !== null) {
      limit = Number(raw);
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new ApiError(400, 'INVALID_LIMIT', '`limit` must be an integer between 1 and 100.');
      }
    }
    return { profiles: await getFeed({ limit }) };
  });
}
