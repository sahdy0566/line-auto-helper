# Maintaining

This is a small service. Keep changes small enough that the next maintainer can read them in one sitting.

## Before Pushing

```bash
npm run validate
```

This runs:

- `npm run validate:rules`
- `npm run lint`
- `npm test`

## When Editing Replies

Most day-to-day changes should only touch `data/replies.json`.

Checklist:

- keep replies short
- avoid private phone numbers, tokens, or internal notes
- prefer `includes` unless exact wording matters
- use `regex` only when the pattern is easy to explain
- run `npm run validate:rules`

## After Deployment

Check:

```bash
curl https://your-deployed-domain.example/healthz
curl https://your-deployed-domain.example/readyz
```

If `/readyz` fails, check these first:

- `LINE_CHANNEL_ACCESS_TOKEN`
- `LINE_CHANNEL_SECRET`
- `data/replies.json`

## Light Monitoring

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://your-deployed-domain.example/admin/metrics
```

Metrics are in-memory and reset on restart. That is fine for basic maintenance. Add persistent monitoring only when the bot becomes business-critical.

## Releases

Update `CHANGELOG.md` when behavior changes for users or operators. Skip changelog entries for typo-only edits.
