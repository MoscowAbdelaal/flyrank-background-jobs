const express = require('express');
const { Inngest } = require('inngest');
const { serve } = require('inngest/express');
const axios = require('axios');
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
// FUNCTION
// ============================================
const makeReport = inngest.createFunction(
    { id: 'make-report', triggers: [{ event: 'report/requested' }] },
    async ({ step, event }) => {
        console.log('🔥 FUNCTION FIRED!');
        console.log('📦 Event:', event.data);
        const { id, topic } = event.data || {};
        await step.sleep('working', '3s');
        if (id) {
            reports[id] = { ...reports[id], topic, status: 'done', result: `Report: ${topic}` };
            console.log(`✅ Report ${id} completed!`);
        }
        return { done: true };
    }
);

app.use('/api/inngest', serve({ client: inngest, functions: [makeReport] }));

// ============================================
// TRIGGER FUNCTION VIA EVENT
// ============================================
async function triggerWithEvent(id, topic) {
    try {
        // Send event using the SDK - this is the intended way
        const result = await inngest.send({
            name: 'report/requested',
            data: { id, topic },
        });
        console.log('✅ Event sent via SDK');
        return true;
    } catch (error) {
        console.log('❌ SDK failed:', error.message);
        return false;
    }
}

// ============================================
// API: CREATE REPORT
// ============================================
app.post('/reports', async (req, res) => {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic required' });
    const id = `report_${Date.now()}`;
    reports[id] = { id, topic, status: 'pending' };
    
    console.log(`📝 Report ${id} created`);
    
    // Try to trigger via SDK
    const triggered = await triggerWithEvent(id, topic);
    
    if (triggered) {
        console.log('✅ Function should trigger automatically!');
    } else {
        console.log(`⚠️ SDK failed. Please check the Dashboard.`);
        console.log(`   To manually trigger, use: {"id":"${id}","topic":"${topic}"}`);
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
    console.log(`\n📋 Function: make-report`);
    console.log(`\n🔴 IMPORTANT: The SDK event sending is not working.`);
    console.log(`📌 To trigger the function, use the Dashboard:`);
    console.log(`   1. Open http://localhost:8288`);
    console.log(`   2. Click on 'make-report'`);
    console.log(`   3. Click 'Invoke'`);
    console.log(`   4. Enter: {"id":"report_xxx","topic":"cats"}`);
});
