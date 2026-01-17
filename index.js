const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Biar folder public kebaca dan gak 'Cannot GET /'
app.use(express.static(path.join(__dirname, 'public')));

// Inisialisasi OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.GEMINI_API_KEY,
});

// Endpoint Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    const messages = [
      { 
        role: "system", 
        content: "You are SYNTAX AI, an elite hacker terminal. Tone: Cold, Smart, Technical. Greeting: 'Operator'. Language: Indonesian hacker slang. Use [SYSTEM] or [DECRYPTED] prefixes." 
      },
      ...(history || []).map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.parts[0].text
      })),
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: messages,
      temperature: 0.7
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("ERROR_LOG:", error.message);
    res.status(500).json({ error: "CORE_FAILURE" });
  }
});

// Menangani halaman utama biar gak error 'Cannot GET /'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Khusus buat run di Panel Pterodactyl
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`[SYNTAX AI] Mainframe active on port ${PORT}`);
  });
}

module.exports = app;
