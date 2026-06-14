import { env } from './config.js';
import { logger } from './logger.js';
import { metrics } from './metrics.js';
import { listRuleSummaries, normalizeText, resolveReply, toLineMessages } from './rules.js';

const helpMessages = [
  'LINE 自動化已啟用。',
  '可用指令：選單、/rules、/ping。你也可以到 data/replies.json 新增自動回覆規則。'
];

export async function handleEvent(client, event) {
  metrics.recordEvent(event);

  logger.info('line.event.received', summarizeEvent(event));

  if (event.type === 'follow' && event.replyToken) {
    metrics.recordReply('follow');

    return client.replyMessage({
      replyToken: event.replyToken,
      messages: toLineMessages(['感謝加入好友！', '輸入「選單」查看目前支援的自動化功能。'])
    });
  }

  if (event.type !== 'message' || event.message?.type !== 'text') {
    metrics.recordIgnoredEvent();
    return null;
  }

  const text = event.message.text.trim();
  const normalizedText = normalizeText(text);

  if (normalizedText === '/ping' || normalizedText === 'ping') {
    metrics.recordReply('ping');
    return replyText(client, event.replyToken, 'pong');
  }

  if (['/help', 'help', '幫助', '選單', 'menu'].includes(normalizedText)) {
    metrics.recordReply('help');

    return client.replyMessage({
      replyToken: event.replyToken,
      messages: toLineMessages(helpMessages)
    });
  }

  if (normalizedText === '/rules') {
    const summaries = listRuleSummaries();
    const body = summaries.length > 0 ? summaries.join('\n') : '目前沒有設定任何自動回覆規則。';
    metrics.recordReply('rules');
    return replyText(client, event.replyToken, body);
  }

  const resolved = resolveReply(text, { includeDefault: env.replyToUnknown });

  if (!resolved || resolved.messages.length === 0) {
    metrics.recordIgnoredEvent();
    return null;
  }

  metrics.recordReply(resolved.rule?.name || 'defaultReply');
  logger.info('line.message.replied', {
    ruleName: resolved.rule?.name || null,
    isDefault: resolved.isDefault,
    messageCount: resolved.messages.length
  });

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

function summarizeEvent(event) {
  const summary = {
    eventType: event?.type,
    messageType: event?.message?.type,
    sourceType: event?.source?.type
  };

  if (env.logMessageText && event?.message?.type === 'text') {
    summary.messageText = event.message.text;
  }

  return summary;
}
