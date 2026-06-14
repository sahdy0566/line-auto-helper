import fs from 'node:fs';

import { env } from './config.js';
import { loadRules } from './rules.js';
import { validateRulesConfig } from './rule-validation.js';

export function healthStatus() {
  return {
    ok: true,
    service: 'line-auto-helper',
    environment: env.nodeEnv,
    uptimeSeconds: Math.round(process.uptime())
  };
}

export function readinessStatus() {
  const checks = {
    lineChannelAccessToken: Boolean(env.channelAccessToken),
    lineChannelSecret: Boolean(env.channelSecret),
    rulesFileReadable: false,
    rulesFileValid: false
  };

  let validation = {
    ok: false,
    ruleCount: 0,
    errors: [],
    warnings: []
  };

  try {
    const raw = fs.readFileSync(new URL('../data/replies.json', import.meta.url), 'utf8');
    checks.rulesFileReadable = true;
    validation = validateRulesConfig(JSON.parse(raw));
    checks.rulesFileValid = validation.ok;
  } catch (error) {
    validation.errors.push(error.message);
  }

  let activeRuleCount = 0;

  try {
    activeRuleCount = loadRules().rules.length;
  } catch {
    activeRuleCount = 0;
  }

  const ok = Object.values(checks).every(Boolean);

  return {
    ok,
    checks,
    activeRuleCount,
    validation
  };
}
