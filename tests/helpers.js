import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

/** Points the store at a fresh temp file for each test. */
export function useTempDb(t) {
  const dir = mkdtempSync(path.join(tmpdir(), 'coy-discover-'));
  const previous = process.env.COY_DATA_FILE;
  process.env.COY_DATA_FILE = path.join(dir, 'db.json');
  t.after(() => {
    if (previous === undefined) delete process.env.COY_DATA_FILE;
    else process.env.COY_DATA_FILE = previous;
    rmSync(dir, { recursive: true, force: true });
  });
  return process.env.COY_DATA_FILE;
}
