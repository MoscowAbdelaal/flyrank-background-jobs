const express = require('express');
const { Inngest } = require('inngest');
const { serve } = require('inngest/express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ============================================
// INNGEST CLIENT
// ============================================
const inngest = new Inngest({
    id: 'report-api',
    isDev: true,
});

// ============================================
// INNGEST FUNCTIONS
// ============================================

// Function 1: Say Hello (test function)
const sayHello = inngest.createFunction(
    {
        id: 'say-hello',
        name: 'Say Hello',
        retries: 0,
    },
    { event: 'test/hello' },
    async ({ step, event }) => {
        console.log('👋 Say hello function started!');
        console.log('📦 Event data:', event.data);
        await step.sleep('wait-a-bit', '5s');
        console.log('✅ Say hello function completed!');
        return {
            message: 'Hello from the background!',
            received: event.data,
        };
    }
);

// ============================================
// INNGEST SERVE
// ============================================
app.use(
    '/api/inngest',
    serve({
        client: inngest,
        functions: [sayHello],
    })
);

// ============================================
// API ENDPOINT TO TRIGGER EVENT (Using HTTP to Dev Server)
// ============================================
app.post('/trigger/hello', async (req, res) => {
    try {
        console.log('📤 Sending event via HTTP to Dev Server...');

        // Send event directly to the Dev Server's HTTP endpoint
        const response = await axios.post(
            'http://localhost:8288/api/events',
            {
                name: 'test/hello',
                data: {
                    message: req.body.message || 'Hello from API!',
                    timestamp: new Date().toISOString(),
                    source: 'postman',
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('✅ Event sent successfully!');
        res.json({
            success: true,
            message: 'Event sent!',
            response: response.data,
        });
    } catch (error) {
        console.error('❌ Error sending event:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        res.status(500).json({
            error: error.message,
            details: error.response?.data || 'Unknown error',
        });
    }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`📚 Health: http://localhost:${PORT}/health`);
    console.log(`📡 Inngest: http://localhost:${PORT}/api/inngest`);
    console.log(`🔔 Trigger: http://localhost:${PORT}/trigger/hello`);
    console.log(`📊 Dashboard: http://localhost:8288`);
    console.log(`\n💡 Test: curl -X POST http://localhost:${PORT}/trigger/hello -H "Content-Type: application/json" -d '{"message":"test"}'`);
});

module.exports = app;
