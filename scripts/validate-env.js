import { requireEnv } from '../src/config.js';

requireEnv(['LINE_CHANNEL_ACCESS_TOKEN', 'LINE_CHANNEL_SECRET']);

console.log('Environment variables are ready.');
