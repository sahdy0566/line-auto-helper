import assert from 'node:assert/strict';
import test from 'node:test';

import { validateRulesConfig } from '../src/rule-validation.js';
import { findMatchingRule, resolveReply, toLineMessages } from '../src/rules.js';

const rulesConfig = {
  defaultReply: 'default',
  rules: [
    {
      name: 'exact',
      match: 'exact',
      keywords: ['選單'],
      reply: 'menu'
    },
    {
      name: 'includes',
      match: 'includes',
      keywords: ['價格'],
      reply: 'price'
    },
    {
      name: 'regex',
      match: 'regex',
      keywords: ['^訂單[0-9]+$'],
      reply: 'order'
    }
  ]
};

test('findMatchingRule supports exact match', () => {
  assert.equal(findMatchingRule('選單', rulesConfig).name, 'exact');
});

test('findMatchingRule supports includes match', () => {
  assert.equal(findMatchingRule('請問價格多少', rulesConfig).name, 'includes');
});

test('findMatchingRule supports regex match', () => {
  assert.equal(findMatchingRule('訂單12345', rulesConfig).name, 'regex');
});

test('resolveReply can return the default reply', () => {
  const result = resolveReply('unknown', { rulesConfig, includeDefault: true });
  assert.equal(result.isDefault, true);
  assert.deepEqual(result.messages, [{ type: 'text', text: 'default' }]);
});

test('toLineMessages limits replies to five messages', () => {
  const messages = toLineMessages(['1', '2', '3', '4', '5', '6']);
  assert.equal(messages.length, 5);
});

test('validateRulesConfig rejects invalid regex rules', () => {
  const result = validateRulesConfig({
    rules: [
      {
        name: 'bad regex',
        match: 'regex',
        keywords: ['['],
        reply: 'broken'
      }
    ]
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /not a valid regex/);
});

test('validateRulesConfig accepts the fixture rules', () => {
  const result = validateRulesConfig(rulesConfig);
  assert.equal(result.ok, true);
  assert.equal(result.ruleCount, 3);
});
