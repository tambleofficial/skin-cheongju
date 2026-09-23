import { cp, mkdir, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';

// Compatibility build for existing Cloudflare Pages settings.
// The site is already production-ready at the repository root.
// If Build command is `node prepare-seo.mjs` and output directory is `public`,
// this script mirrors the static site into public without rewriting SEO content.
const root = process.cwd();
const out = join(root, 'public');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const skip = new Set(['public', '.git', '.github', 'node_modules']);
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (skip.has(entry.name)) continue;
  await cp(join(root, entry.name), join(out, entry.name), { recursive: true });
}
console.log('THE RE:FINE static site copied to public/.');
