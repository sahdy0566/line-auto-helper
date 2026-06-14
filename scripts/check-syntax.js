import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirs = ['src', 'scripts', 'test'];

function collectJavaScriptFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return collectJavaScriptFiles(fullPath);
    }

    return entry.isFile() && entry.name.endsWith('.js') ? [fullPath] : [];
  });
}

const files = sourceDirs.flatMap((dir) => collectJavaScriptFiles(path.join(rootDir, dir)));
let hasFailure = false;

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });

  if (result.status !== 0) {
    hasFailure = true;
  }
}

if (hasFailure) {
  process.exit(1);
}

console.log(`Checked ${files.length} JavaScript files.`);
