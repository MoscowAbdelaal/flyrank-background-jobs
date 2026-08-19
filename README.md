# flyrank-background-jobs

Background jobs with Inngest — fast API, slow work in the background.

## Quick Start

```bash
npm install
npm run dev
Inngest Dev Server

bash
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
Dashboard: http://localhost:8288

API Endpoints

Method	Endpoint	Description
POST	/reports	Create a report (returns 202)
GET	/reports/:id	Check report status
Workflow

Create a report via API
Trigger the function via Inngest Dashboard
Check status via API
Functions

Function	Trigger	Description
make-report	report/requested	Creates a report (3s work)
Demo

bash
# Create report
curl -X POST http://localhost:3000/reports -H "Content-Type: application/json" -d '{"topic":"cats"}'

# Check status
curl http://localhost:3000/reports/report_xxx

# Trigger via Dashboard
# Open http://localhost:8288 -> make-report -> Invoke

# Check status again
curl http://localhost:3000/reports/report_xxx
