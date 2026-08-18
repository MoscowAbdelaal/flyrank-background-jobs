# flyrank-background-jobs

Background jobs with Inngest — fast API, slow work in the background, cron jobs.

## Quick Start

```bash
npm install
npm run dev
Endpoints

Method	Endpoint	Description
GET	/health	Health check
POST	/reports	Create a report (background job)
GET	/reports/:id	Get report status
Functions

Function	Trigger	Description
say-hello	test/hello	Test function
make-report	report/requested	Creates report
heartbeat	cron: * * * * *	Runs every minute
Inngest Dashboard

bash
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
Open http://localhost:8288
