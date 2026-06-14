import express from 'express';
import * as line from '@line/bot-sdk';

import { env, requireEnv } from './config.js';
import { handleEvent } from './handler.js';

requireEnv(['LINE_CHANNEL_ACCESS_TOKEN', 'LINE_CHANNEL_SECRET']);

const app = express();
const client = line.LineBotClient.fromChannelAccessToken({
  channelAccessToken: env.channelAccessToken
});

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    name: 'line-auto-helper',
    webhook: '/webhook'
  });
});

app.post('/webhook', line.middleware({ channelSecret: env.channelSecret }), async (req, res) => {
  try {
    const results = await Promise.all(req.body.events.map((event) => handleEvent(client, event)));
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

app.listen(env.port, () => {
  console.log(`LINE bot listening on http://localhost:${env.port}`);
});
