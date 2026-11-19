import { getMatches } from '../../lib/discover.js';
import { handle } from '../../lib/http.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** GET /matches → { matches: { profile, matchedAt }[] } — mutual matches only, newest first. */
export async function GET() {
  return handle(async () => ({ matches: await getMatches() }));
}
