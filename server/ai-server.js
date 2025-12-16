require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// NOTE: This is a skeleton/example file. Use the official @google/generative SDK/API details.
// The import below is a placeholder and may not match the real package shape.
// const {TextGenerationClient} = require('@google/generative');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Placeholder client
// const client = new TextGenerationClient({ apiKey: process.env.GOOGLE_API_KEY });

app.post('/api/ai/chat', async (req, res) => {
  const { prompt } = req.body;
  try {
    // TODO: call Gemini API server-side and return result
    // const response = await client.generateText({ model: 'gemini-1.0', prompt });
    // res.json({ reply: response?.text || '' });

    // temporary placeholder reply for local dev
    res.json({ reply: `(placeholder AI reply) Received: ${prompt}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI error' });
  }
});

app.post('/api/ai/planner', async (req, res) => {
  const { goals, timeAvailable, level } = req.body;
  try {
    // TODO: call Gemini API server-side
    const plan = `Sample plan for goals: ${goals}, ${timeAvailable} minutes/day, level ${level}.`;
    res.json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI error' });
  }
});

app.post('/api/ai/summary', async (req, res) => {
  try {
    // TODO: use user logs / stats from DB and call Gemini to generate a rich summary
    // For local dev we return a placeholder summary
    const summary = `Weekly Summary:\n- Completed tasks: 5\n- Hours coded: 8\n- Streak: 3 days\n- Suggested improvements: Practice timed problems and focus on async/await.`;
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI error' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`AI server listening on :${port}`));
