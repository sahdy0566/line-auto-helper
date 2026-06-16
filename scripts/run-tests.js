import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const testDir = path.join(rootDir, 'test');

function collectTestFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return collectTestFiles(fullPath);
    }

    return entry.isFile() && entry.name.endsWith('.test.js') ? [fullPath] : [];
  });
}

const files = collectTestFiles(testDir);

if (files.length === 0) {
  console.error('No test files found.');
  process.exit(1);
}

const result = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit' });
process.exit(result.status || 0);
