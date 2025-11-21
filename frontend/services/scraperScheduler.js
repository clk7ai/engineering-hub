import NewsScraper from './newsScraper.js';

/**
 * ScraperScheduler - Manages periodic scraping and background tasks
 * Handles scheduling, retry logic, and persistence
 */
class ScraperScheduler {
  constructor(options = {}) {
    this.scraper = new NewsScraper();
    this.isRunning = false;
    this.intervalId = null;
    
    // Configuration
    this.config = {
      enabled: options.enabled !== false,
      intervalMinutes: options.intervalMinutes || 30, // Run every 30 minutes
      maxRetries: options.maxRetries || 3,
      retryDelayMs: options.retryDelayMs || 5000,
      startOnInit: options.startOnInit || false,
      useWorker: options.useWorker !== false,
      storageKey: 'scraperScheduler_state',
      ...options
    };
    
    // State tracking
    this.state = {
      lastRun: null,
      nextRun: null,
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      lastError: null,
      articlesThisCycle: 0
    };
    
    // Load saved state
    this.loadState();
    
    // Initialize
    if (this.config.startOnInit) {
      this.start();
    }
  }
  
  /**
   * Load state from localStorage
   */
  loadState() {
    try {
      const saved = localStorage.getItem(this.config.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load scheduler state:', error);
    }
  }
  
  /**
   * Save state to localStorage
   */
  saveState() {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.state));
    } catch (error) {
      console.warn('Failed to save scheduler state:', error);
    }
  }
  
  /**
   * Start the scheduler
   */
  async start() {
    if (this.isRunning) {
      console.log('Scheduler already running');
      return;
    }
    
    this.isRunning = true;
    console.log(`Starting scraper scheduler (interval: ${this.config.intervalMinutes} minutes)`);
    
    // Run immediately on start
    await this.executeScrape();
    
    // Set up interval for subsequent runs
    this.scheduleNextRun();
    
    // Update backend
    await this.updateBackendStatus(true);
  }
  
  /**
   * Stop the scheduler
   */
  async stop() {
    if (!this.isRunning) {
      console.log('Scheduler not running');
      return;
    }
    
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('Scheduler stopped');
    
    // Update backend
    await this.updateBackendStatus(false);
  }
  
  /**
   * Schedule the next run
   */
  scheduleNextRun() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    const intervalMs = this.config.intervalMinutes * 60 * 1000;
    
    this.intervalId = setInterval(() => {
      if (this.isRunning) {
        this.executeScrape();
      }
    }, intervalMs);
    
    this.state.nextRun = new Date(Date.now() + intervalMs).toISOString();
    this.saveState();
  }
  
  /**
   * Execute a scraping cycle with retry logic
   */
  async executeScrape(retryCount = 0) {
    try {
      console.log(`Executing scrape cycle (Attempt ${retryCount + 1}/${this.config.maxRetries})`);
      
      this.state.lastRun = new Date().toISOString();
      this.state.totalRuns++;
      
      // Execute the scraper
      const result = await this.scraper.startScraping();
      
      this.state.successfulRuns++;
      this.state.articlesThisCycle = result.length || 0;
      this.state.lastError = null;
      
      console.log(`Scrape cycle completed. Articles added: ${this.state.articlesThisCycle}`);
      
      this.saveState();
      
      // Emit event for UI updates
      this.emitEvent('scraperCycleComplete', {
        articlesAdded: this.state.articlesThisCycle,
        timestamp: this.state.lastRun,
        stats: this.getStats()
      });
      
    } catch (error) {
      console.error('Scrape cycle failed:', error);
      
      this.state.failedRuns++;
      this.state.lastError = error.message;
      this.saveState();
      
      // Retry logic
      if (retryCount < this.config.maxRetries - 1) {
        console.log(`Retrying in ${this.config.retryDelayMs}ms...`);
        setTimeout(() => {
          this.executeScrape(retryCount + 1);
        }, this.config.retryDelayMs);
      } else {
        // Max retries reached
        this.emitEvent('scraperError', {
          error: error.message,
          retryCount,
          timestamp: new Date().toISOString()
        });
      }
    }
  }
  
  /**
   * Update backend with scraper status
   */
  async updateBackendStatus(isRunning) {
    try {
      const response = await fetch('http://localhost:5000/api/scraper/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isRunning,
          lastError: this.state.lastError
        })
      });
      
      if (!response.ok) {
        console.warn('Failed to update backend status');
      }
    } catch (error) {
      console.warn('Could not reach backend:', error);
    }
  }
  
  /**
   * Get current statistics
   */
  getStats() {
    return {
      isRunning: this.isRunning,
      lastRun: this.state.lastRun,
      nextRun: this.state.nextRun,
      totalRuns: this.state.totalRuns,
      successfulRuns: this.state.successfulRuns,
      failedRuns: this.state.failedRuns,
      articlesThisCycle: this.state.articlesThisCycle,
      lastError: this.state.lastError
    };
  }
  
  /**
   * Manually trigger a scrape
   */
  async triggerManualScrape() {
    console.log('Manual scrape triggered');
    await this.executeScrape();
    
    this.emitEvent('manualScrapeTrigger', {
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Emit events for UI listeners
   */
  emitEvent(eventType, data) {
    const event = new CustomEvent(`scraper:${eventType}`, {
      detail: data
    });
    window.dispatchEvent(event);
  }
  
  /**
   * Listen for scraper events
   */
  on(eventType, callback) {
    window.addEventListener(`scraper:${eventType}`, (event) => {
      callback(event.detail);
    });
  }
}

// Export as singleton or instance
const schedulerInstance = new ScraperScheduler({
  intervalMinutes: 30,
  startOnInit: false,
  enabled: true
});

export default ScraperScheduler;
export { schedulerInstance };
