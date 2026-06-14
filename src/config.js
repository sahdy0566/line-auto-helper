import 'dotenv/config';

export const env = {
  port: Number.parseInt(process.env.PORT || '3000', 10),
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  replyToUnknown: process.env.REPLY_TO_UNKNOWN === 'true',
  broadcastText: process.env.LINE_BROADCAST_TEXT || ''
};

export function requireEnv(names) {
  const missing = names.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
