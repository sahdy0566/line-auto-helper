import assert from 'node:assert/strict';
import test from 'node:test';

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
