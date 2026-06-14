import { randomUUID } from 'node:crypto';
import * as line from '@line/bot-sdk';

import { env, requireEnv } from '../src/config.js';
import { toLineMessages } from '../src/rules.js';

requireEnv(['LINE_CHANNEL_ACCESS_TOKEN']);

const messageText = process.argv.slice(2).join(' ').trim() || env.broadcastText;

if (!messageText) {
  console.error('Missing broadcast text. Pass it as an argument or set LINE_BROADCAST_TEXT.');
  process.exit(1);
}

const client = line.LineBotClient.fromChannelAccessToken({
  channelAccessToken: env.channelAccessToken
});

const retryKey = process.env.LINE_RETRY_KEY || randomUUID();

await client.broadcast(
  {
    messages: toLineMessages(messageText)
  },
  retryKey
);

console.log(`Broadcast sent with retry key ${retryKey}`);
