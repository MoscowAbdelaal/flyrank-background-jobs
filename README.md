# flyrank-background-jobs

Background jobs with Inngest — fast API, slow work in the background, cron jobs.

## Quick Start

```bash
# Install dependencies
npm install

# Terminal 1: Start the API
npm run dev

# Terminal 2: Start the Inngest Dev Server
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
Architecture

text
Client → POST /reports → 202 Accepted → Inngest Event → Background Job → Status Update
                                                              ↓
                                                        GET /reports/:id
                                                              ↓
                                                    pending → done | failed
API Endpoints

Method	Endpoint	Description	Status Codes
GET	/health	Health check	200
POST	/reports	Create a report	202, 400
GET	/reports/:id	Get report status	200, 404
Functions

Function	Trigger	Description	Retries
make-report	event: report/requested	Creates a report (3s work)	2
heartbeat	cron: * * * * *	Runs every minute, logs summary	0
Demo

bash
# Create a report
curl -X POST http://localhost:3000/reports \
  -H "Content-Type: application/json" \
  -d '{"topic": "cats"}'

# Response: {"id":"report_xxx","status":"pending"}

# Check status
curl http://localhost:3000/reports/report_xxx

# Trigger the function via Inngest Dashboard
# Open http://localhost:8288 → make-report → Invoke

# Check status again
curl http://localhost:3000/reports/report_xxx
# Response: {"id":"report_xxx","topic":"cats","status":"done","result":"Report: cats"}
Testing Failures & Retries

bash
# Create a report with topic "fail"
curl -X POST http://localhost:3000/reports \
  -H "Content-Type: application/json" \
  -d '{"topic": "fail"}'

# Trigger via Dashboard → function will fail and retry 3 times
Cron Expressions

Expression	Meaning
* * * * *	Every minute
0 8 * * *	Every day at 08:00
0 22 * * 0	Every Sunday at 22:00
Dashboard

Open http://localhost:8288 to see:

Function runs
Retries
Logs
Cron job executions
Technologies

Node.js + Express
Inngest (background jobs + cron)
Inngest Dev Server (local dashboard)
Author

Marwan Abdelaal
