import fs from 'node:fs';

import { validateRulesConfig } from '../src/rule-validation.js';

const rulesPath = process.argv[2] || new URL('../data/replies.json', import.meta.url);
const raw = fs.readFileSync(rulesPath, 'utf8');
const result = validateRulesConfig(JSON.parse(raw));

for (const warning of result.warnings) {
  console.warn(`Warning: ${warning}`);
}

if (!result.ok) {
  for (const error of result.errors) {
    console.error(`Error: ${error}`);
  }

  process.exit(1);
}

console.log(`Rules file is valid. Loaded ${result.ruleCount} rules.`);
