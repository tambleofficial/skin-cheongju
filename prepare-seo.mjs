import { cp, mkdir, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';
const root = process.cwd(), out = join(root, 'public');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const entry of await readdir(root, { withFileTypes: true })) {
 if (entry.name === 'assets' || /\.(html|xml)$/.test(entry.name) || ['robots.txt','_headers','_redirects'].includes(entry.name)) {
  await cp(join(root, entry.name), join(out, entry.name), { recursive: true });
 }
}
console.log('THE RE:FINE production files ready in public/');
