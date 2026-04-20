const express = require('express');
const router = express.Router();
const axios = require('axios');

module.exports = (authenticateToken, checkDatabaseConnection, groqAxios) => {

    router.post('/simulate-trial', authenticateToken, checkDatabaseConnection, async (req, res) => {
        try {
            const { description, evidence_files } = req.body;
            if (!description) return res.status(400).json({ error: 'Description required' });

            let ragContext = '';
            const FLASK_URL = process.env.FLASK_BACKEND_URL;
            if (FLASK_URL) {
                try {
                    const ragPayload = { query: `Provide legal context and relevant Indian law for: ${description}` };
                    const ragResponse = await axios.post(`${FLASK_URL}/query`, ragPayload, { timeout: 60000 });
                    ragContext = ragResponse.data?.answer ? String(ragResponse.data.answer) : '';
                } catch (err) {
                    console.warn('⚠️ RAG context unavailable for trial, proceeding with Groq only.');
                }
            }

            const groqKeys = (process.env.GROQ_API_KEYS || '').split(',').map(k => k.trim()).filter(k => k);
            if (groqKeys.length === 0) return res.status(500).json({ error: 'AI keys missing - configure GROQ_API_KEYS in .env' });

            let trialSuccess = false;
            let lastError = null;

            // Try each API key with fallback
            for (let attempt = 0; attempt < groqKeys.length && !trialSuccess; attempt++) {
                try {
                    const groqKey = groqKeys[attempt];
                    console.log(`⚖️ Trial Attempt ${attempt + 1}/${groqKeys.length} - Judge AI Processing...`);

                    const response = await axios.post(`${process.env.GROQ_BASE_URL}/chat/completions`, {
                        model: process.env.GROQ_MODEL_NAME || 'llama-3.3-70b-versatile',
                        messages: [
                            {
                                role: 'system',
                                content: `You are a high-stakes AI Judge and Legal Strategist for the Indian Legal System. 
                                User will provide a case description and evidence.
                                You must output a JSON object with these exact keys:
                                {
                                    "petitioner_argument": "Strongest legal points for the petitioner (bullet points)",
                                    "respondent_argument": "Strongest counter-arguments/risks (bullet points)",
                                    "judge_verdict": "A concise, decisive verdict based on Indian Law.",
                                    "win_probability": 85,
                                    "critical_warning": "Any major legal loophole or risk."
                                }
                                Do not include markdown formatting, just raw JSON.`
                            },
                            { role: 'user', content: `Case Description: ${description}\nEvidence: ${evidence_files?.join(', ') || 'None'}${ragContext ? `\n\nRAG Context:\n${ragContext}` : ''}` }
                        ],
                        temperature: 0.5,
                        response_format: { type: "json_object" }
                    }, {
                        headers: { 
                            'Authorization': `Bearer ${groqKey}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 60000
                    });

                    console.log('✅ Trial Simulation Success');
                    trialSuccess = true;
                    res.json(JSON.parse(response.data.choices[0].message.content));

                } catch (err) {
                    lastError = err.response?.data || err.message;
                    console.error(`❌ Trial Attempt ${attempt + 1} Failed:`, lastError);
                    
                    // On rate limit, try next key
                    if (err.response?.status === 429 || err.response?.status === 401) {
                        console.log('🔄 Rotating to next API key...');
                    }
                }
            }

            if (!trialSuccess) {
                console.error('❌ All Judge API attempts failed');
                res.status(500).json({ 
                    error: 'Trial simulation failed - all API keys exhausted',
                    details: lastError 
                });
            }

        } catch (err) {
            console.error('❌ Trial Error:', err.message);
            if (err.response) console.error('📦 API Error Data:', JSON.stringify(err.response.data, null, 2));
            res.status(500).json({ error: 'Trial simulation failed', details: err.message });
        }
    });

    return router;
};
