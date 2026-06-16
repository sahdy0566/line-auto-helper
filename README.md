# LINE Auto Helper

Small LINE Messaging API service for a personal or small-team LINE official account.

The repo is intentionally boring: one Express app, one JSON rules file, a few operational endpoints, and GitHub Actions for checks and scheduled broadcasts. It is meant to be easy to inspect after a few months away.

## Current Shape

What it does today:

- receives LINE webhook events at `POST /webhook`
- replies to text messages from `data/replies.json`
- sends a welcome message on follow
- exposes `/healthz` and `/readyz` for deployment checks
- exposes `/admin/metrics` and `/admin/broadcast` behind `ADMIN_TOKEN`
- runs CI for syntax, reply-rule validation, and tests
- can send a scheduled weekly LINE broadcast from GitHub Actions

What it deliberately does not do yet:

- no database
- no user profile storage
- no dashboard UI
- no per-user segmentation
- in-memory metrics reset when the process restarts

That keeps the first version maintainable. If the bot starts handling real customer workflows, add persistent storage before adding more complicated automations.

## Setup

```bash
npm install
cp .env.example .env
npm run validate
npm start
```

Fill `.env`:

```bash
LINE_CHANNEL_ACCESS_TOKEN=your LINE channel access token
LINE_CHANNEL_SECRET=your LINE channel secret
ADMIN_TOKEN=a long random value
```

Local checks:

```bash
curl http://localhost:3000/healthz
curl http://localhost:3000/readyz
```

LINE webhook URL:

```text
https://your-deployed-domain.example/webhook
```

## Reply Rules

Edit [data/replies.json](data/replies.json).

```json
{
  "name": "營業時間",
  "match": "includes",
  "keywords": ["營業時間", "服務時間"],
  "reply": "我們的服務時間是週一到週五 09:00-18:00。"
}
```

After changing rules:

```bash
npm run validate:rules
npm test
```

Rule notes are in [docs/rules.md](docs/rules.md).

## Admin Endpoints

Admin endpoints require:

```text
Authorization: Bearer <ADMIN_TOKEN>
```

Metrics:

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://your-deployed-domain.example/admin/metrics
```

Manual broadcast:

```bash
curl -X POST https://your-deployed-domain.example/admin/broadcast \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"今天有新活動，歡迎查看。"}'
```

CLI broadcast:

```bash
npm run broadcast -- "今天有新活動，歡迎查看。"
```

## Operations

Day-to-day notes:

- keep `LOG_MESSAGE_TEXT=false` unless debugging locally
- rotate `ADMIN_TOKEN` if it is ever pasted into a shared place
- check `/readyz` after changing environment variables
- run `npm run validate` before pushing changes
- run `npm run smoke` when server startup or admin endpoints change
- update [CHANGELOG.md](CHANGELOG.md) when user-visible behavior changes

Deployment notes are in [docs/deployment.md](docs/deployment.md). LINE setup notes are in [docs/line-setup.md](docs/line-setup.md). The short maintenance checklist is in [MAINTAINING.md](MAINTAINING.md), and recent upkeep is tracked in [docs/maintenance-log.md](docs/maintenance-log.md).
