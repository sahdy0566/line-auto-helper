# Deployment Notes

This project runs anywhere that supports Node.js 22. Render is the easiest path because `render.yaml` is already included, but Docker works too.

## 必要環境變數

```bash
LINE_CHANNEL_ACCESS_TOKEN=你的 LINE channel access token
LINE_CHANNEL_SECRET=你的 LINE channel secret
ADMIN_TOKEN=長隨機字串
NODE_ENV=production
LOG_LEVEL=info
LOG_MESSAGE_TEXT=false
REPLY_TO_UNKNOWN=false
```

Keep `LOG_MESSAGE_TEXT=false` in production. It prevents normal user messages from being written to logs.

## Render

Use the included `render.yaml` as a Blueprint. After creating the service, add:

- `LINE_CHANNEL_ACCESS_TOKEN`
- `LINE_CHANNEL_SECRET`
- `ADMIN_TOKEN`

After deploy, put the Render domain plus `/webhook` into LINE Developers Console.

## Docker

```bash
docker build -t line-auto-helper .
docker run --rm -p 3000:3000 --env-file .env line-auto-helper
```

Health checks:

```bash
curl http://localhost:3000/healthz
curl http://localhost:3000/readyz
```

## GitHub Actions 廣播

Scheduled broadcast is handled by `.github/workflows/line-broadcast.yml`. Set:

- Secret：`LINE_CHANNEL_ACCESS_TOKEN`
- Variable：`LINE_BROADCAST_TEXT`

GitHub Actions cron uses UTC. `0 1 * * 1` means Monday 09:00 in Taiwan.

## Post-deploy Smoke Test

```bash
curl https://your-deployed-domain.example/healthz
curl https://your-deployed-domain.example/readyz
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://your-deployed-domain.example/admin/metrics
```

Do not test broadcast against a production LINE account unless the message is safe to send to every friend of the official account.
