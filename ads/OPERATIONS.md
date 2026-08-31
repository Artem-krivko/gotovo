# Ads integration operations runbook

This runbook describes the safe operating model for the internal advertising
tooling in this repository. It covers access verification and preparation; it
does not authorize campaign changes or spend.

## Connected accounts

- Yandex Direct: the configured OAuth application has the `direct:api` scope.
- Google Ads manager: `570-737-3950`.
- Google Ads advertiser: `211-905-4297` (`usegotovo.by`).
- Google Cloud project: `gotovo-seo`, project number `94361772104`.

## Local credentials

Credentials live only in `ads/.env.local` with filesystem mode `0600`. The file
is ignored by Git. Never paste client secrets, refresh tokens, developer
tokens, or OAuth authorization codes into source files, issues, commits, or
logs. Use `ads/env.example` as the only shareable template.

## Modes and approvals

1. Default mode is read-only. Use it for account visibility and reporting
   checks.
2. Account writes require a separate, explicit owner approval for the exact
   operation and target account.
3. Spend requires a second approval. Campaigns must remain paused until the
   spend gate is approved.
4. Every mutation plan must be reviewed in dry-run form before execution.

No API script may silently enable campaigns, raise budgets, or retry a failed
mutation. Unexpected permissions, customer IDs, or API responses fail closed.

## Verification commands

```bash
npm run ads:yandex:check
npm run ads:google:check
```

These commands are read-only. They verify credentials and list accessible
accounts; they do not create, update, pause, enable, or delete advertising
resources.

## Google access status

OAuth and read-only access are working. The Google Ads API developer token is
currently at test access. A Basic Access application was submitted on 31 August
2026; wait for Google's review before attempting production-level operations.

## Change and incident procedure

- Keep all implementation changes on `codex/ads-attribution-v1` until reviewed.
- Record the reason, operator, platform, account, operation, and result in
  `ads/logs/` without writing secrets or lead personal data.
- If credentials may be exposed, revoke or rotate them immediately and update
  only the local ignored environment file.
- Re-run the read-only checks after rotation and before any future dry-run.

## Before advertising work begins

Complete the site measurement audit first: GA4 and consent behavior, Yandex
Metrica, form/contact events, UTM and click identifiers, conversion definitions,
source persistence in leads, landing-page intent, and form transport. SEO work
must be checked for overlap with these same tags, forms, URLs, and analytics
events before changes are made.
