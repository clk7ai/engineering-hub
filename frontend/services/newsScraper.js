/**
 * News Scraper Service
 * Runs on frontend to fetch news from multiple sources
 * and sends aggregated content to backend database
 * Reduces backend load by running scraping on client
 */

// Configuration for news sources
const NEWS_SOURCES = {
  techCrunch: {
    url: 'https://techcrunch.com',
    rssUrl: 'https://feeds.techcrunch.com/techcrunch/startups',
    category: 'innovation'
  },
  hackernews: {
    url: 'https://news.ycombinator.com',
    rssUrl: 'https://news.ycombinator.com/rss',
    category: 'innovation'
  },
  arxiv: {
    url: 'https://arxiv.org',
    rssUrl: 'https://arxiv.org/rss/cs.AI',
    category: 'science'
  },
  github: {
    url: 'https://github.com/trending',
    category: 'innovation'
  },
  mediumTech: {
    url: 'https://medium.com/tag/technology',
    category: 'science'
  },
  redditEngineering: {
    url: 'https://reddit.com/r/engineering',
    category: 'innovation'
  },
  bbcTech: {
    url: 'https://bbc.com/news/technology',
    category: 'innovation'
  },
  wiredScience: {
    url: 'https://wired.com/science',
    category: 'science'
  }
};

class NewsScraper {
  constructor(backendUrl = 'http://localhost:5000') {
    this.backendUrl = backendUrl;
    this.isRunning = false;
    this.lastScrapeTime = null;
    this.scrapedArticles = [];
    this.sourceStats = {};
    this.initializeStats();
  }

  initializeStats() {
    Object.keys(NEWS_SOURCES).forEach(source => {
      this.sourceStats[source] = {
        lastScrape: null,
        articlesFound: 0,
        errors: 0
      };
    });
  }

  /**
   * Parse RSS feed and extract articles
   */
  async parseRSSFeed(feedUrl, source) {
    try {
      const response = await fetch(feedUrl, {
        headers: { 'Accept': 'application/rss+xml' }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'application/xml');
      
      if (xmlDoc.parsererror) {
        throw new Error('Failed to parse RSS feed');
      }
      
      const items = xmlDoc.querySelectorAll('item');
      const articles = [];
      
      items.forEach(item => {
        const article = {
          title: this.getElementText(item, 'title'),
          link: this.getElementText(item, 'link'),
          description: this.getElementText(item, 'description'),
          pubDate: this.getElementText(item, 'pubDate'),
          author: this.getElementText(item, 'creator') || this.getElementText(item, 'author'),
          source: source,
          sourceUrl: NEWS_SOURCES[source].url,
          category: NEWS_SOURCES[source].category,
          imageUrl: this.extractImageFromDescription(this.getElementText(item, 'description')),
          scrapedAt: new Date().toISOString(),
          originalContent: true,
          rights: `Content from ${source}. See original at ${NEWS_SOURCES[source].url}`
        };
        
        // Only add if title and link exist
        if (article.title && article.link) {
          articles.push(article);
        }
      });
      
      this.sourceStats[source].articlesFound = articles.length;
      this.sourceStats[source].lastScrape = new Date();
      return articles;
    } catch (error) {
      console.error(`Error parsing RSS from ${source}:`, error);
      this.sourceStats[source].errors++;
      return [];
    }
  }

  /**
   * Helper to get element text content
   */
  getElementText(element, tagName) {
    const el = element.querySelector(tagName);
    return el ? el.textContent.trim() : '';
  }

  /**
   * Extract image URL from description
   */
  extractImageFromDescription(description) {
    if (!description) return null;
    const imgMatch = description.match(/<img[^>]+src="?([^"\s>]+)"?/i);
    return imgMatch ? imgMatch[1] : null;
  }

  /**
   * Check for duplicate articles using multiple strategies
   */
  async checkDuplicate(article) {
    try {
      const response = await fetch(
        `${this.backendUrl}/api/articles/check-duplicate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: article.title,
            link: article.link,
            source: article.source
          })
        }
      );
      
      if (!response.ok) return false;
      const data = await response.json();
      return data.isDuplicate;
    } catch (error) {
      console.warn('Duplicate check failed:', error);
      return false;
    }
  }

  /**
   * Normalize and validate article data
   */
  normalizeArticle(article) {
    return {
      ...article,
      title: article.title.substring(0, 500), // Limit title
      description: article.description.substring(0, 2000), // Limit description
      content: article.description, // Store full content
      source: article.source,
      originalLink: article.link, // Original source link
      isAggregated: true,
      needsAttributionDisplay: true,
      createdAt: new Date(article.pubDate),
      scrapedAt: new Date().toISOString()
    };
  }

  /**
   * Send article to backend database
   */
  async sendToBackend(article) {
    try {
      // Check for duplicates first
      const isDuplicate = await this.checkDuplicate(article);
      if (isDuplicate) {
        console.log(`Skipping duplicate: ${article.title}`);
        return { success: false, reason: 'duplicate' };
      }
      
      const normalized = this.normalizeArticle(article);
      
      const response = await fetch(
        `${this.backendUrl}/api/articles/aggregate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(normalized)
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, articleId: data.id };
    } catch (error) {
      console.error('Error sending article to backend:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Start scraping from all sources
   */
  async startScraping() {
    if (this.isRunning) {
      console.log('Scraper is already running');
      return;
    }
    
    this.isRunning = true;
    console.log('Starting news scraper...');
    
    try {
      const allArticles = [];
      
      // Scrape all sources in parallel
      const sourcePromises = Object.entries(NEWS_SOURCES).map(([source, config]) => {
        if (config.rssUrl) {
          return this.parseRSSFeed(config.rssUrl, source)
            .then(articles => ({ source, articles }))
            .catch(error => {
              console.error(`Error scraping ${source}:`, error);
              return { source, articles: [] };
            });
        }
        return Promise.resolve({ source, articles: [] });
      });
      
      const results = await Promise.all(sourcePromises);
      
      // Process articles and send to backend
      for (const { source, articles } of results) {
        for (const article of articles) {
          const result = await this.sendToBackend(article);
          if (result.success) {
            allArticles.push(article);
            console.log(`✓ Added article: ${article.title.substring(0, 50)}...`);
          }
        }
      }
      
      this.lastScrapeTime = new Date();
      this.scrapedArticles = allArticles;
      
      console.log(`Scraping complete. Found and added ${allArticles.length} articles`);
      this.logStats();
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Log scraping statistics
   */
  logStats() {
    console.log('\n=== Scraper Statistics ===' );
    console.log(`Total articles added: ${this.scrapedArticles.length}`);
    console.log(`Last scrape: ${this.lastScrapeTime}`);
    console.log('\nPer-source stats:');
    Object.entries(this.sourceStats).forEach(([source, stats]) => {
      console.log(`  ${source}: ${stats.articlesFound} articles, ${stats.errors} errors`);
    });
  }

  /**
   * Get scraper status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastScrapeTime: this.lastScrapeTime,
      articlesScraped: this.scrapedArticles.length,
      sourceStats: this.sourceStats
    };
  }
}

export default NewsScraper;
