// Simple Express proxy to call Gemini API using server-side API key
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not set. Set it in your environment or .env file.');
}

app.post('/api/gemini', async (req, res) => {
  try {
    const body = req.body || {};
    const response = await fetch('https://api.openai.com/v1/embeddings', { // placeholder endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify(body)
    });
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
