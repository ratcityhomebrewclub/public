import fs from 'node:fs';
import path from 'node:path';
import site from 'config/site';

// Reads a markdown file from /content at build time.
export function getContent(file) {
  const fullPath = path.join(process.cwd(), site.contentDir, file);
  try {
    return fs.readFileSync(fullPath, 'utf8');
  } catch {
    return '';
  }
}
