# Evidence — Background Jobs with Inngest

## Phase 0: Hello Server
- ✅ `GET /health` returns 200

## Phase 1: Inngest Connected
- ✅ Inngest client created
- ✅ `say-hello` function works (5s sleep)
- ✅ Dashboard accessible at http://localhost:8288

## Phase 2: Background Jobs

### API Endpoints
```bash
# Create report (202)
curl -X POST http://localhost:3000/reports -H "Content-Type: application/json" -d '{"topic":"cats"}'
# Response: {"id":"report_xxx","status":"pending"}

# Check status (pending)
curl http://localhost:3000/reports/report_xxx
# Response: {"id":"report_xxx","topic":"cats","status":"pending"}

# Trigger via Dashboard → function runs

# Check status (done)
curl http://localhost:3000/reports/report_xxx
# Response: {"id":"report_xxx","topic":"cats","status":"done","result":"Report: cats"}
Phase 3: Retries & Failures

Failure Test

bash
# Create report with topic "fail"
curl -X POST http://localhost:3000/reports -H "Content-Type: application/json" -d '{"topic":"fail"}'
Dashboard shows:

Attempt 1: Failed ❌
Attempt 2: Failed ❌ (backoff)
Attempt 3: Failed ❌ (backoff)
Final status: Failed
Server Logs:

text
💥 THROWING ERROR!
Inngest function error
Error: 🔥 The report oven is broken!
Validation (400)

bash
curl -X POST http://localhost:3000/reports -H "Content-Type: application/json" -d '{}'
# Response: {"error": "Topic required"}
Phase 4: Cron Job

Heartbeat Function

Trigger: * * * * * (every minute)
Logs: 💓 Heartbeat cron job running!
Summary: Total, Pending, Done, Failed
Server Logs:

text
💓 Heartbeat cron job running!
📊 Summary: Total: 5, Pending: 0, Done: 4, Failed: 1
Screenshots

Dashboard: http://localhost:8288
Runs visible for all functions
Date

2026-08-19
