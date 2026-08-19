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
Inngest Dashboard

Function: make-report
Trigger: report/requested
Runs visible at http://localhost:8288
Server Logs

text
🔥 FUNCTION FIRED!
📦 Event: { id: 'report_1787098870276', topic: 'cats' }
✅ Report report_1787098870276 completed!
