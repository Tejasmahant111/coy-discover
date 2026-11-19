import { resetState } from '../../lib/db.js';
import { handle } from '../../lib/http.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** POST /reset — demo helper: clears all swipes and matches so the demo can be replayed. */
export async function POST() {
  return handle(async () => {
    await resetState();
    return { ok: true };
  });
}
