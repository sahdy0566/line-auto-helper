import { env } from './config.js';
import { listRuleSummaries, normalizeText, resolveReply, toLineMessages } from './rules.js';

const helpMessages = [
  'LINE 自動化已啟用。',
  '可用指令：選單、/rules、/ping。你也可以到 data/replies.json 新增自動回覆規則。'
];

export async function handleEvent(client, event) {
  if (event.type === 'follow' && event.replyToken) {
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: toLineMessages(['感謝加入好友！', '輸入「選單」查看目前支援的自動化功能。'])
    });
  }

  if (event.type !== 'message' || event.message?.type !== 'text') {
    return null;
  }

  const text = event.message.text.trim();
  const normalizedText = normalizeText(text);

  if (normalizedText === '/ping' || normalizedText === 'ping') {
    return replyText(client, event.replyToken, 'pong');
  }

  if (['/help', 'help', '幫助', '選單', 'menu'].includes(normalizedText)) {
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: toLineMessages(helpMessages)
    });
  }

  if (normalizedText === '/rules') {
    const summaries = listRuleSummaries();
    const body = summaries.length > 0 ? summaries.join('\n') : '目前沒有設定任何自動回覆規則。';
    return replyText(client, event.replyToken, body);
  }

  const resolved = resolveReply(text, { includeDefault: env.replyToUnknown });

  if (!resolved || resolved.messages.length === 0) {
    return null;
  }

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: resolved.messages
  });
}

function replyText(client, replyToken, text) {
  return client.replyMessage({
    replyToken,
    messages: [{ type: 'text', text }]
  });
}
