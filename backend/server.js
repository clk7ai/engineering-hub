const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample data for all categories
const articles = {
  all: [
    { id: 1, title: 'Latest Engineering Breakthroughs', category: 'Innovation', date: '2025-11-22', author: 'Tech Team' },
    { id: 2, title: 'AI in Manufacturing', category: 'Science', date: '2025-11-21', author: 'Science Desk' },
    { id: 3, title: 'Sustainable Energy Solutions', category: 'Energy', date: '2025-11-20', author: 'Energy Expert' },
  ],
  innovation: [
    { id: 4, title: 'Next-Gen Solar Panels', category: 'Innovation', date: '2025-11-22' },
    { id: 5, title: '5G Network Expansion', category: 'Innovation', date: '2025-11-21' },
  ],
  science: [
    { id: 6, title: 'Quantum Computing Breakthrough', category: 'Science', date: '2025-11-22' },
    { id: 7, title: 'Space Exploration Advances', category: 'Science', date: '2025-11-21' },
  ],
  culture: [
    { id: 8, title: 'Engineering in Modern Architecture', category: 'Culture', date: '2025-11-22' },
  ],
  health: [
    { id: 9, title: 'Medical Device Innovations', category: 'Health', date: '2025-11-22' },
  ],
  transportation: [
    { id: 10, title: 'Electric Vehicles Future', category: 'Transportation', date: '2025-11-22' },
  ],
  military: [
    { id: 11, title: 'Defense Technology Updates', category: 'Military', date: '2025-11-22' },
  ],
  energy: [
    { id: 12, title: 'Renewable Energy Grid', category: 'Energy', date: '2025-11-22' },
  ]
};

const videos = [
  { id: 1, title: 'How Modern Engines Work', category: 'Innovation', thumbnail: 'thumbnail1.jpg' },
  { id: 2, title: 'Future of Electric Cars', category: 'Transportation', thumbnail: 'thumbnail2.jpg' },
];

const research = [
  { id: 1, title: 'AI in Industry 4.0', topic: 'Artificial Intelligence', date: '2025-11-20' },
  { id: 2, title: 'Quantum Computing Potential', topic: 'Computing', date: '2025-11-19' },
];

const interviews = [
  { id: 1, title: 'Interview with Tech CEO', guest: 'John Smith', date: '2025-11-22' },
  { id: 2, title: 'Future of Engineering Panel', guest: 'Expert Panel', date: '2025-11-21' },
];

const newsletters = [
  { id: 1, name: 'The Blueprint', description: 'Daily news digest', frequency: 'Daily' },
  { id: 2, name: 'AI Logs', description: 'AI advancements', frequency: 'Weekly' },
  { id: 3, name: 'Engineer Pros', description: 'Career insights', frequency: 'Weekly' },
  { id: 4, name: 'The Vital Component', description: 'Top engineering stories', frequency: 'Weekly' },
  { id: 5, name: 'Gears in Motion', description: 'Mechanical engineering', frequency: 'Weekly' },
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Engineering Hub API is running', status: 'ok' });
});

app.get('/api/articles', (req, res) => {
  const category = req.query.category || 'all';
  const categoryArticles = articles[category] || articles.all;
  res.json(categoryArticles);
});

app.get('/api/videos', (req, res) => {
  res.json(videos);
});

app.get('/api/research', (req, res) => {
  res.json(research);
});

app.get('/api/interviews', (req, res) => {
  res.json(interviews);
});

app.get('/api/newsletters', (req, res) => {
  res.json(newsletters);
});

app.get('/api/categories', (req, res) => {
  res.json([
    { id: 'innovation', name: 'Innovation', icon: '💡' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'culture', name: 'Culture', icon: '🎭' },
    { id: 'health', name: 'Health', icon: '⚕️' },
    { id: 'transportation', name: 'Transportation', icon: '🚗' },
    { id: 'military', name: 'Military', icon: '⚔️' },
    { id: 'energy', name: 'Energy', icon: '⚡' },
  ]);
});

app.post('/api/newsletter/subscribe', (req, res) => {
  const { email, newsletter } = req.body;
  res.json({ message: 'Subscribed successfully', email, newsletter });
});

app.post('/api/articles', (req, res) => {
  res.json({ message: 'Article created', data: req.body });
});

// In-memory storage for aggregated articles
let aggregatedArticles = [];
let scraperStatus = {
  isRunning: false,
  lastScrapeTime: null,
  totalArticlesAdded: 0,
  lastError: null
};

// POST endpoint for receiving scraped articles from frontend
app.post('/api/articles/aggregate', (req, res) => {
  const { articles } = req.body;
  
  if (!Array.isArray(articles)) {
    return res.status(400).json({ error: 'Articles must be an array' });
  }
  
  try {
    let addedCount = 0;
    
    articles.forEach(article => {
      // Check for duplicates by title and source
      const isDuplicate = aggregatedArticles.some(
        existing => existing.title === article.title && existing.source === article.source
      );
      
      if (!isDuplicate) {
        // Add unique ID
        const newArticle = {
          id: aggregatedArticles.length + 1,
          ...article,
          addedAt: new Date().toISOString(),
          isAggregated: true
        };
        aggregatedArticles.push(newArticle);
        addedCount++;
      }
    });
    
    scraperStatus.totalArticlesAdded += addedCount;
    scraperStatus.lastScrapeTime = new Date().toISOString();
    
    res.json({
      message: `Successfully added ${addedCount} new articles`,
      addedCount,
      totalArticles: aggregatedArticles.length
    });
  } catch (error) {
    scraperStatus.lastError = error.message;
    res.status(500).json({ error: 'Failed to add articles', details: error.message });
  }
});

// GET endpoint to check for duplicates
app.post('/api/articles/check-duplicate', (req, res) => {
  const { title, source } = req.body;
  
  const isDuplicate = aggregatedArticles.some(
    article => article.title === title && article.source === source
  );
  
  res.json({ isDuplicate });
});

// GET aggregated articles endpoint
app.get('/api/articles/aggregated', (req, res) => {
  const limit = req.query.limit || 50;
  const category = req.query.category;
  
  let filtered = aggregatedArticles;
  
  if (category) {
    filtered = aggregatedArticles.filter(a => a.category === category);
  }
  
  res.json({
    total: filtered.length,
    articles: filtered.slice(0, limit)
  });
});

// GET scraper status endpoint
app.get('/api/scraper/status', (req, res) => {
  res.json({
    ...scraperStatus,
    totalAggregatedArticles: aggregatedArticles.length
  });
});

// POST endpoint to update scraper status
app.post('/api/scraper/status', (req, res) => {
  const { isRunning, lastError } = req.body;
  
  if (isRunning !== undefined) {
    scraperStatus.isRunning = isRunning;
  }
  
  if (lastError !== undefined) {
    scraperStatus.lastError = lastError;
  }
  
  scraperStatus.lastScrapeTime = new Date().toISOString();
  
  res.json({ message: 'Scraper status updated', status: scraperStatus });
});

// GET endpoint to retrieve aggregated articles by source
app.get('/api/articles/by-source', (req, res) => {
  const source = req.query.source;
  
  if (!source) {
    return res.status(400).json({ error: 'Source parameter required' });
  }
  
  const sourceArticles = aggregatedArticles.filter(a => a.source === source);
  
  res.json({
    source,
    count: sourceArticles.length,
    articles: sourceArticles
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Engineering Hub API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
