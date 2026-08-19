const express = require('express');
const { Inngest } = require('inngest');
const { serve } = require('inngest/express');
require('dotenv').config();

const app = express();
app.use(express.json());
const PORT = 3000;

const reports = {};

const inngest = new Inngest({
    id: 'report-api',
    isDev: true,
});

// ============================================
// FUNCTION 1: MAKE REPORT (Background Job)
// ============================================
const makeReport = inngest.createFunction(
    {
        id: 'make-report',
        triggers: [{ event: 'report/requested' }],
        retries: 2,
    },
    async ({ step, event }) => {
        console.log('🔥 FUNCTION FIRED!');
        console.log('📦 Event:', event.data);
        
        const { id, topic } = event.data || {};
        
        await step.sleep('working', '2s');
        
        if (topic === 'fail') {
            console.log('💥 THROWING ERROR!');
            throw new Error('🔥 The report oven is broken!');
        }
        
        if (id) {
            reports[id] = {
                ...reports[id],
                topic,
                status: 'done',
                result: `Report: ${topic}`,
            };
            console.log(`✅ Report ${id} completed!`);
        }
        
        return { done: true };
    }
);

// ============================================
// FUNCTION 2: HEARTBEAT (Cron Job - Every Minute)
// ============================================
const heartbeat = inngest.createFunction(
    {
        id: 'heartbeat',
        name: 'Heartbeat',
        triggers: [{ cron: '* * * * *' }],  // Every minute
    },
    async ({ step }) => {
        console.log('💓 Heartbeat cron job running!');
        
        const total = Object.keys(reports).length;
        const pending = Object.values(reports).filter(r => r.status === 'pending').length;
        const done = Object.values(reports).filter(r => r.status === 'done').length;
        const failed = Object.values(reports).filter(r => r.status === 'failed').length;
        
        console.log(`📊 Summary: Total: ${total}, Pending: ${pending}, Done: ${done}, Failed: ${failed}`);
        
        return {
            total,
            pending,
            done,
            failed,
            timestamp: new Date().toISOString(),
        };
    }
);

app.use('/api/inngest', serve({ client: inngest, functions: [makeReport, heartbeat] }));

// ============================================
// API: CREATE REPORT
// ============================================
app.post('/reports', async (req, res) => {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic required' });
    const id = `report_${Date.now()}`;
    reports[id] = { id, topic, status: 'pending' };
    
    console.log(`📝 Report ${id} created`);
    
    try {
        await inngest.send({
            name: 'report/requested',
            data: { id, topic },
        });
        console.log('✅ Event sent');
    } catch (error) {
        console.log('⚠️ SDK error:', error.message);
    }
    
    res.status(202).json({ id, status: 'pending' });
});

app.get('/reports/:id', (req, res) => {
    const r = reports[req.params.id];
    if (!r) return res.status(404).json({ error: 'Not found' });
    res.json(r);
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:8288`);
    console.log(`\n📋 Functions:`);
    console.log(`  - make-report (retries: 2, event: report/requested)`);
    console.log(`  - heartbeat (cron: * * * * * - every minute)`);
    console.log(`\n💡 Test heartbeat: Watch Dashboard for runs every minute`);
});
