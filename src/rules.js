import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRulesPath = path.resolve(currentDir, '../data/replies.json');

export function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

export function loadRules(rulesPath = defaultRulesPath) {
  const raw = fs.readFileSync(rulesPath, 'utf8');
  const data = JSON.parse(raw);

  return {
    defaultReply: data.defaultReply || '',
    rules: Array.isArray(data.rules) ? data.rules : []
  };
}

export function toLineMessages(reply) {
  const items = Array.isArray(reply) ? reply : [reply];

  return items
    .filter((item) => item !== undefined && item !== null && item !== '')
    .slice(0, 5)
    .map((item) => {
      if (typeof item === 'string') {
        return { type: 'text', text: item };
      }

      if (typeof item === 'object') {
        return item;
      }

      return { type: 'text', text: String(item) };
    });
}

export function findMatchingRule(text, rulesConfig = loadRules()) {
  const normalizedText = normalizeText(text);

  return rulesConfig.rules.find((rule) => {
    const keywords = Array.isArray(rule.keywords) ? rule.keywords : [];
    const matchMode = rule.match || 'includes';

    return keywords.some((keyword) => {
      const normalizedKeyword = normalizeText(keyword);

      if (!normalizedKeyword) {
        return false;
      }

      if (matchMode === 'exact') {
        return normalizedText === normalizedKeyword;
      }

      if (matchMode === 'regex') {
        try {
          return new RegExp(keyword, 'i').test(text);
        } catch {
          return false;
        }
      }

      return normalizedText.includes(normalizedKeyword);
    });
  });
}

export function resolveReply(text, options = {}) {
  const rulesConfig = options.rulesConfig || loadRules();
  const rule = findMatchingRule(text, rulesConfig);

  if (rule) {
    return {
      rule,
      isDefault: false,
      messages: toLineMessages(rule.reply)
    };
  }

  if (options.includeDefault && rulesConfig.defaultReply) {
    return {
      rule: null,
      isDefault: true,
      messages: toLineMessages(rulesConfig.defaultReply)
    };
  }

  return null;
}

export function listRuleSummaries(rulesConfig = loadRules()) {
  return rulesConfig.rules.map((rule, index) => {
    const name = rule.name || `規則 ${index + 1}`;
    const keywords = Array.isArray(rule.keywords) ? rule.keywords.join(' / ') : '無關鍵字';

    return `${index + 1}. ${name}: ${keywords}`;
  });
}
