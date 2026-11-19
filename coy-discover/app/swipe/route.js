import { recordSwipe } from '../../lib/discover.js';
import { handle, readJsonBody } from '../../lib/http.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /swipe  { profileId: string, action: "like" | "pass" }
 *   → { matched: false }
 *   → { matched: true, match: { profile, matchedAt } }
 */
export async function POST(request) {
  return handle(async () => {
    const body = await readJsonBody(request);
    const { profileId, action } = body && typeof body === 'object' ? body : {};
    return recordSwipe({ profileId, action });
  });
}
