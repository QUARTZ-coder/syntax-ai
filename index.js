const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inisialisasi OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.GEMINI_API_KEY, // Tetep pake nama variabel ini di Vercel biar gak ribet
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001", // Sesuaikan dengan model di OpenRouter
      messages: [
        { role: "system", content: "You are SYNTAX AI, a hacker persona assistant." },
        { role: "user", content: message }
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "CONNECTION_FAILED_TO_OPENROUTER" });
  }
});

module.exports = app;
