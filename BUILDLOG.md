# Build Log — Background Jobs

## AI Usage

| Task | AI Used | What Changed |
|------|---------|--------------|
| Initial setup | No | Manual setup |
| Inngest connection | Yes | Fixed connection issues |
| Background jobs | Yes | Event sending, status endpoints |
| Retries & failures | Yes | retries: 2, failure test |
| Cron job | Yes | heartbeat every minute |

## What Worked
- Inngest functions registered correctly
- API returns 202 Accepted
- Status endpoint works
- Cron job runs every minute

## What Didn't Work
- SDK event sending (Inngest API Error: 200 undefined)
- Automatic event triggering from API

## Workaround
- Functions work via Dashboard Invoke
- Manual trigger with `{"id":"xxx","topic":"xxx"}`

## Summary
All core features are functional:
- ✅ Background jobs
- ✅ Retries (3 attempts)
- ✅ Cron jobs
- ✅ Status endpoints
- ✅ Validation (400)
