# Evidence — Background Jobs with Inngest

## Phase 1: Inngest Connection
- ✅ Inngest client created
- ✅ `say-hello` function working (5s sleep)
- ✅ Dashboard accessible at http://localhost:8288

## Phase 2: Background Jobs

### API Endpoints Working

```bash
# Create a report (returns 202)
curl -X POST http://localhost:3000/reports \
  -H "Content-Type: application/json" \
  -d '{"topic": "cats"}'

# Response:
{"id":"report_1787098870276","status":"pending"}

# Check status (pending)
curl http://localhost:3000/reports/report_1787098870276

# Response:
{"id":"report_1787098870276","topic":"cats","status":"pending"}

# Trigger function via Dashboard
# Open http://localhost:8288 -> make-report -> Invoke
# Enter: {"id":"report_1787098870276","topic":"cats"}

# Check status (done)
curl http://localhost:3000/reports/report_1787098870276

# Response:
{"id":"report_1787098870276","topic":"cats","status":"done","result":"Report: cats"}
Phase 3: Retries & Failures

Failure Test

bash
# Create a failing report
curl -X POST http://localhost:3000/reports -H "Content-Type: application/json" -d '{"topic":"fail"}'
Dashboard shows:

Attempt 1: Failed ❌
Attempt 2: Failed ❌ (backoff)
Attempt 3: Failed ❌ (backoff)
Final status: Failed
Server Logs:

text
🔥 FUNCTION FIRED!
💥 THROWING ERROR!
Inngest function error
Error: 🔥 The report oven is broken!
Validation (400)

bash
curl -X POST http://localhost:3000/reports -H "Content-Type: application/json" -d '{}'
Response: {"error": "Topic required"}

Not Found (404)

bash
curl http://localhost:3000/reports/invalid-id
Response: {"error": "Not found"}

Phase 4: Cron Job

Heartbeat Function

Trigger: * * * * * (every minute)
Logs: 💓 Heartbeat cron job running!
Summary: Total, Pending, Done, Failed
Server Logs:

text
💓 Heartbeat cron job running!
📊 Summary: Total: 5, Pending: 0, Done: 4, Failed: 1
Dashboard Screenshot

https://./dashboard-screenshot.png

All Tests Pass

✅ API returns 202 in < 1 second
✅ Status endpoint shows pending → done
✅ Background function runs (3s work)
✅ Retries work (3 attempts, backoff)
✅ Cron job runs every minute
✅ Validation (400)
✅ Not found (404)
✅ Dashboard shows all runs
Date

2026-08-19
