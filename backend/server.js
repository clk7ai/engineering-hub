const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Engineering Hub API is running' });
});

app.get('/api/articles', (req, res) => {
  res.json([
    { id: 1, title: 'Latest Engineering Breakthroughs', category: 'Tech', date: '2025-11-22' },
    { id: 2, title: 'AI in Manufacturing', category: 'AI', date: '2025-11-21' },
    { id: 3, title: 'Sustainable Energy Solutions', category: 'Green', date: '2025-11-20' }
  ]);
});

app.post('/api/articles', (req, res) => {
  res.json({ message: 'Article created', data: req.body });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
