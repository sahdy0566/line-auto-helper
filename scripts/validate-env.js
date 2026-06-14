import { requireEnv } from '../src/config.js';

requireEnv(['LINE_CHANNEL_ACCESS_TOKEN', 'LINE_CHANNEL_SECRET']);

if (!process.env.ADMIN_TOKEN) {
  console.warn('ADMIN_TOKEN is not set. Admin metrics and admin broadcast endpoints will stay disabled.');
}

console.log('Environment variables are ready.');
