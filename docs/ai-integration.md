# Gemini (@google/generative) Integration Guide

This project includes UI scaffolding for AI features (chat, planner, weekly summary). The front-end calls placeholder endpoints such as `/api/ai/chat` and `/api/ai/planner`. You'll need a small server that calls the Gemini / @google/generative SDK.

Example Node/Express server (install dependencies first):

1. Install packages:

```bash
npm install express dotenv body-parser @google/generative
```

2. Create `server/ai-server.js` (example below). Set environment variable `GOOGLE_API_KEY` with your key.

3. Start the server and proxy requests from the frontend to `http://localhost:4000/api/ai/*`.

Example server snippet (for reference):

```js
// server/ai-server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const {TextGenerationClient} = require('@google/generative'); // placeholder import - check the official SDK docs

const app = express();
app.use(bodyParser.json());

const client = new TextGenerationClient({ apiKey: process.env.GOOGLE_API_KEY });

app.post('/api/ai/chat', async (req, res) => {
  const { prompt } = req.body;
  try {
    // Use the official examples / SDK from Google generative models here
    const response = await client.generateText({ model: 'gemini-1.0', prompt });
    res.json({ reply: response?.text || '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI error' });
  }
});

app.post('/api/ai/planner', async (req, res) => {
  const { goals, timeAvailable, level } = req.body;
  try {
    const prompt = `Create a daily study plan. Goals: ${goals}. Minutes per day: ${timeAvailable}. Level: ${level}.`;
    const response = await client.generateText({ model: 'gemini-1.0', prompt });
    res.json({ plan: response?.text || '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI error' });
  }
});

app.listen(4000, () => console.log('AI server listening on :4000'));
```

Notes:
- Replace `@google/generative` and `TextGenerationClient` usage with the correct, up-to-date SDK APIs from Google's docs.
- Do not embed API keys in the frontend. Keep them server-side.
- Add proper rate limiting, caching and cost tracking for production.

If you'd like, I can:
- add the example server file to the repo (without secrets),
- wire the front-end dev server proxy to forward `/api` to `http://localhost:4000`,
- or implement example API handlers for local testing.
