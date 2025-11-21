# Engineering Hub - Web Scraper Documentation

## Overview

The Engineering Hub Web Scraper is a distributed scraping system that runs on the frontend to reduce backend load. It automatically aggregates content from multiple news sources, deduplicates articles, and sends them to the backend database for display on the news aggregator.

**IMPORTANT**: This is a news aggregator, NOT a direct publisher. All content maintains proper source attribution and links to original articles.

## Architecture

### Multi-Phase Implementation

The scraper system is implemented across 5 phases:

#### Phase 1: Frontend Scraper Service (`frontend/services/newsScraper.js`)
- RSS feed parsing from 8 news sources
- Article extraction and normalization
- Image handling and content enrichment
- Duplicate detection
- Backend API integration

#### Phase 2: Backend API Endpoints (`backend/server.js`)
- Article aggregation endpoints
- Duplicate checking mechanism
- Status tracking and monitoring
- Statistics collection

#### Phase 3: Scheduler & Persistence (`frontend/services/scraperScheduler.js`)
- Interval-based scheduling (default 30 minutes)
- Retry logic with exponential backoff
- State persistence using localStorage
- Event-driven architecture for UI updates

#### Phase 4: Monitoring Dashboard (`frontend/ScraperDashboard.js`)
- Real-time status display
- Statistics visualization
- Control buttons (Start/Stop/Manual Trigger)
- Event listeners for live updates

#### Phase 5: Documentation
- Architecture guide
- API documentation
- Configuration guide
- Usage examples

## Data Flow

```
News Sources (RSS Feeds)
        ↓
    Frontend Scraper Service
        ↓ (normalized articles)
Duplicate Detection
        ↓ (unique articles)
Backend API (/api/articles/aggregate)
        ↓
Backend Database (In-memory for now)
        ↓
Frontend Display
```

## News Sources

The scraper currently aggregates from 8 sources:

1. **TechCrunch** - Technology news
2. **Hacker News** - Developer and tech news
3. **arXiv** - Academic research papers
4. **GitHub Trending** - Popular repositories
5. **Medium** - Technical articles
6. **Reddit** - Programming communities
7. **BBC Tech** - General technology news
8. **Wired Science** - Science and technology

### Adding New Sources

Edit `frontend/services/newsScraper.js` and add to `NEWS_SOURCES`:

```javascript
const NEWS_SOURCES = {
  // ... existing sources
  yourSource: {
    name: 'Your Source',
    url: 'https://example.com/feed.rss',
    category: 'innovation'
  }
};
```

## Core Components

### 1. NewsScraper Class

**Location**: `frontend/services/newsScraper.js`

**Key Methods**:
- `parseRSSFeed(sourceUrl)` - Parses RSS feed and extracts articles
- `checkDuplicate(title, source)` - Checks backend for duplicates
- `normalizeArticle(article, source)` - Standardizes article format
- `sendToBackend(articles)` - Posts articles to aggregation API
- `startScraping()` - Orchestrates scraping from all sources
- `getStatus()` - Returns current scraper status

**Article Format**:
```javascript
{
  id: number,
  title: string,
  description: string,
  image: string (URL),
  author: string,
  publishDate: ISO 8601 timestamp,
  source: string,
  sourceUrl: string,         // Original article URL
  category: string,          // innovation, science, etc.
  addedAt: ISO 8601 timestamp,
  isAggregated: true
}
```

### 2. ScraperScheduler Class

**Location**: `frontend/services/scraperScheduler.js`

**Key Methods**:
- `start()` - Starts scheduled scraping
- `stop()` - Stops scheduler
- `executeScrape(retryCount)` - Runs scraping cycle
- `triggerManualScrape()` - Manually trigger scrape
- `getStats()` - Get current statistics
- `on(eventType, callback)` - Event listener

**Configuration**:
```javascript
new ScraperScheduler({
  intervalMinutes: 30,        // Default interval
  maxRetries: 3,              // Retry attempts
  retryDelayMs: 5000,         // Delay between retries
  startOnInit: false,         // Auto-start on creation
  enabled: true               // Enable/disable scraper
});
```

### 3. ScraperDashboard Component

**Location**: `frontend/ScraperDashboard.js`

**Features**:
- Toggle visibility
- Display status (Running/Stopped)
- Show statistics (Total Runs, Success Rate, Articles)
- Timeline (Last Run, Next Run)
- Control buttons
- Real-time updates

## Backend API Endpoints

### POST /api/articles/aggregate

Receive and store scraped articles.

**Request**:
```json
{
  "articles": [
    {
      "title": "Article Title",
      "description": "Article content",
      "image": "image-url",
      "author": "Author Name",
      "publishDate": "2025-11-22T10:30:00Z",
      "source": "TechCrunch",
      "sourceUrl": "https://techcrunch.com/article",
      "category": "innovation"
    }
  ]
}
```

**Response**:
```json
{
  "message": "Successfully added 5 new articles",
  "addedCount": 5,
  "totalArticles": 125
}
```

### POST /api/articles/check-duplicate

Check if article already exists.

**Request**:
```json
{
  "title": "Article Title",
  "source": "TechCrunch"
}
```

**Response**:
```json
{
  "isDuplicate": false
}
```

### GET /api/articles/aggregated

Retrieve aggregated articles.

**Query Parameters**:
- `limit` (default: 50) - Number of articles
- `category` (optional) - Filter by category

**Response**:
```json
{
  "total": 45,
  "articles": [{ ... }]
}
```

### GET /api/scraper/status

Get scraper status and statistics.

**Response**:
```json
{
  "isRunning": true,
  "lastScrapeTime": "2025-11-22T11:30:00Z",
  "totalArticlesAdded": 250,
  "lastError": null,
  "totalAggregatedArticles": 500
}
```

### GET /api/articles/by-source

Get articles from specific source.

**Query Parameters**:
- `source` (required) - Source name (e.g., "TechCrunch")

**Response**:
```json
{
  "source": "TechCrunch",
  "count": 25,
  "articles": [{ ... }]
}
```

## Usage Examples

### Starting the Scheduler

```javascript
import { schedulerInstance } from './services/scraperScheduler.js';

// Start scraping
await schedulerInstance.start();

// Runs immediately and then every 30 minutes
```

### Manual Scraping

```javascript
// Trigger a manual scrape
await schedulerInstance.triggerManualScrape();
```

### Listening to Events

```javascript
// Listen for cycle completion
schedulerInstance.on('scraperCycleComplete', (data) => {
  console.log(`Added ${data.articlesAdded} articles`);
  console.log(data.stats);
});

// Listen for errors
schedulerInstance.on('scraperError', (error) => {
  console.error('Scraper error:', error);
});
```

### Getting Statistics

```javascript
const stats = schedulerInstance.getStats();
console.log(`Running: ${stats.isRunning}`);
console.log(`Total runs: ${stats.totalRuns}`);
console.log(`Success rate: ${stats.successfulRuns / stats.totalRuns * 100}%`);
```

## Attribution & Rights

Since Engineering Hub is a news aggregator:

1. **Every article includes source attribution**
2. **Original article URL is provided** - Links to original content
3. **Author information is preserved** - Credited when available
4. **Source metadata is stored** - For tracking and compliance
5. **Articles marked as aggregated** - `isAggregated: true` flag

**Display Guidelines**:
- Always show "Source: [Website]" for each article
- Include link "Read full article at [Original URL]"
- Display publication date and author
- Use RSS content as preview only, not full reproduction

## Performance Considerations

### Why Frontend Scraping?

- **Reduces backend load** - No server-side scraping required
- **Distributed processing** - Load spread across users' browsers
- **Offline capability** - Cached data for offline browsing
- **Rate limiting friendly** - Individual clients less likely to hit limits

### Optimization Strategies

1. **Duplicate detection** - Prevents redundant database entries
2. **Content normalization** - Standardized format reduces storage
3. **Image optimization** - URLs only, not full files
4. **Batch processing** - Multiple sources scraped in parallel
5. **State persistence** - localStorage for recovery

## Error Handling

The scraper includes comprehensive error handling:

1. **Network errors** - Automatic retry with exponential backoff
2. **Feed parsing errors** - Graceful degradation, continue with other sources
3. **Backend connection errors** - Queue for retry
4. **Storage errors** - Fallback to in-memory storage

## Configuration & Customization

### Changing Scrape Interval

```javascript
const scheduler = new ScraperScheduler({
  intervalMinutes: 60  // Scrape every hour
});
```

### Adjusting Retry Policy

```javascript
const scheduler = new ScraperScheduler({
  maxRetries: 5,
  retryDelayMs: 10000  // 10 seconds between retries
});
```

### Disabling Scraper

```javascript
const scheduler = new ScraperScheduler({
  enabled: false
});
```

## Monitoring & Debugging

### Dashboard Component

Include in your app:

```jsx
import ScraperDashboard from './ScraperDashboard';

function App() {
  return (
    <div>
      <ScraperDashboard />
      {/* Other components */}
    </div>
  );
}
```

### Console Logging

Enable debug logging:

```javascript
// NewsScraper logs to console
// ScraperScheduler logs to console
// Check browser console for:
// - Scraping progress
// - Error messages
// - Statistics
```

## Future Enhancements

1. **Web Worker Support** - Background scraping in dedicated thread
2. **Service Worker Integration** - Offline scraping capability
3. **IndexedDB Storage** - Larger data capacity
4. **Incremental Sync** - Only new articles
5. **Source Configuration UI** - Dynamic source management
6. **Machine Learning** - Smart categorization
7. **Sentiment Analysis** - Article sentiment scoring

## License & Attribution

This scraper is built to respect copyright and provide proper attribution to original sources. All content aggregated must include:
- Original source URL
- Author information
- Publication date
- Link to full article

## Support & Issues

For issues or questions:
1. Check the logs in browser console
2. View scraper status in dashboard
3. Review error messages
4. Check backend `/api/scraper/status` endpoint

## Version History

- **v1.0** - Initial release with 5-phase implementation
  - Phase 1: Frontend scraper service
  - Phase 2: Backend API endpoints
  - Phase 3: Scheduler with persistence
  - Phase 4: Monitoring dashboard
  - Phase 5: Documentation
