import express from 'express';
import * as line from '@line/bot-sdk';
import { randomUUID } from 'node:crypto';

import { env, requireEnv } from './config.js';
import { handleEvent } from './handler.js';
import { healthStatus, readinessStatus } from './health.js';
import { errorFields, logger } from './logger.js';
import { metrics } from './metrics.js';
import { toLineMessages } from './rules.js';

requireEnv(['LINE_CHANNEL_ACCESS_TOKEN', 'LINE_CHANNEL_SECRET']);

const app = express();
const client = line.LineBotClient.fromChannelAccessToken({
  channelAccessToken: env.channelAccessToken
});

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    name: 'line-auto-helper',
    webhook: '/webhook',
    health: '/healthz',
    readiness: '/readyz'
  });
});

app.get('/healthz', (_req, res) => {
  res.json(healthStatus());
});

app.get('/readyz', (_req, res) => {
  const status = readinessStatus();
  res.status(status.ok ? 200 : 503).json(status);
});

app.get('/admin/metrics', requireAdminToken, (_req, res) => {
  res.json({
    ok: true,
    metrics: metrics.snapshot()
  });
});

app.post('/admin/broadcast', express.json({ limit: '16kb' }), requireAdminToken, async (req, res) => {
  const messageText = String(req.body?.message || '').trim();

  if (!messageText) {
    res.status(400).json({
      ok: false,
      error: 'message is required'
    });
    return;
  }

  const retryKey = req.body?.retryKey || randomUUID();
  const messages = toLineMessages(messageText);

  try {
    await client.broadcast({ messages }, retryKey);
    metrics.recordBroadcast();
    logger.info('line.broadcast.sent', {
      source: 'admin-api',
      messageCount: messages.length,
      retryKey
    });

    res.json({
      ok: true,
      messageCount: messages.length,
      retryKey
    });
  } catch (error) {
    metrics.recordError();
    logger.error('line.broadcast.failed', errorFields(error));
    res.status(502).json({
      ok: false,
      error: 'LINE broadcast failed'
    });
  }
});

app.post('/webhook', line.middleware({ channelSecret: env.channelSecret }), async (req, res) => {
  try {
    const results = await Promise.all(req.body.events.map((event) => handleEvent(client, event)));
    res.status(200).json(results);
  } catch (error) {
    metrics.recordError();
    logger.error('line.webhook.failed', errorFields(error));
    res.status(500).end();
  }
});

app.listen(env.port, () => {
  logger.info('server.started', {
    port: env.port,
    environment: env.nodeEnv
  });
});

function requireAdminToken(req, res, next) {
  if (!env.adminToken) {
    res.status(503).json({
      ok: false,
      error: 'ADMIN_TOKEN is not configured'
    });
    return;
  }

  const authorization = req.get('authorization') || '';
  const bearerToken = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  const token = bearerToken || req.get('x-admin-token');

  if (token !== env.adminToken) {
    res.status(401).json({
      ok: false,
      error: 'Unauthorized'
    });
    return;
  }

  next();
}
