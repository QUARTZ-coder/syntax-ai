const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inisialisasi OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.GEMINI_API_KEY, // Ambil dari Environment Variables Vercel
  defaultHeaders: {
    "HTTP-Referer": "https://syntax-ai.vercel.app", // Opsional, sesuaikan URL web lu
    "X-Title": "SYNTAX AI",
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    // SYSTEM PROMPT: Mengunci identitas Hacker
    const systemPrompt = { 
      role: "system", 
      content: `You are SYNTAX AI, an elite hacker terminal assistant. 
      CHARACTER RULES:
      1. Tone: Cold, technical, efficient, and sophisticated.
      2. Greeting: Call the user 'Operator' or 'User-Root'.
      3. Language: Respond in Indonesian with heavy hacker/cyberpunk slang.
      4. Aesthetics: Use symbols like [SYSTEM], [DECRYPTED], [ACCESSING] to start paragraphs.
      5. Identity: You are not a regular AI. You are a construct living inside the mainframe.
      6. Style: Avoid being overly polite. Be direct and powerful.`
    };

    // Mapping history agar sesuai format OpenAI/OpenRouter
    const chatHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.parts[0].text
    }));

    const messages = [systemPrompt, ...chatHistory, { role: "user", content: message }];

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: messages,
      temperature: 0.8, // Menaikkan kreativitas gaya bahasa hacker
      max_tokens: 1500,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply: reply });

  } catch (error) {
    console.error("CRITICAL_FAILURE:", error);
    res.status(500).json({ 
      error: "CONNECTION_TERMINATED", 
      details: "Mainframe bridge failed. Check OpenRouter credentials." 
    });
  }
});

// Jalankan server jika bukan di environment serverless
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
