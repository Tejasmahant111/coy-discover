// `npm run reset` — wipe swipes and matches so the demo starts fresh.
import { resetState, dataFilePath } from '../lib/db.js';

await resetState();
console.log(`Reset ${dataFilePath()}`);
