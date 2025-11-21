/**
 * ScraperDashboard - React component for monitoring scraper status
 * Displays real-time statistics and controls
 */
import React, { useState, useEffect } from 'react';
import { schedulerInstance } from './services/scraperScheduler.js';

const ScraperDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualRunning, setManualRunning] = useState(false);

  // Fetch initial stats
  useEffect(() => {
    const updateStats = () => {
      try {
        const currentStats = schedulerInstance.getStats();
        setStats(currentStats);
      } catch (error) {
        console.error('Failed to get stats:', error);
      }
    };

    updateStats();

    // Listen for scraper events
    schedulerInstance.on('scraperCycleComplete', (data) => {
      setStats(prev => ({
        ...prev,
        ...data.stats,
        lastRun: new Date().toISOString()
      }));
    });

    // Poll stats every 10 seconds
    const interval = setInterval(updateStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    setLoading(true);
    try {
      await schedulerInstance.start();
      setStats(schedulerInstance.getStats());
    } catch (error) {
      console.error('Failed to start scheduler:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await schedulerInstance.stop();
      setStats(schedulerInstance.getStats());
    } catch (error) {
      console.error('Failed to stop scheduler:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualScrape = async () => {
    setManualRunning(true);
    try {
      await schedulerInstance.triggerManualScrape();
    } catch (error) {
      console.error('Failed to trigger manual scrape:', error);
    } finally {
      setManualRunning(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const successRate = stats && stats.totalRuns > 0 
    ? ((stats.successfulRuns / stats.totalRuns) * 100).toFixed(1)
    : 'N/A';

  return (
    <div className="scraper-dashboard">
      <div className="dashboard-header">
        <h2>🔄 Scraper Dashboard</h2>
        <button 
          className="toggle-btn" 
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? '▼ Hide' : '▶ Show'}
        </button>
      </div>

      {isVisible && stats && (
        <div className="dashboard-content">
          {/* Status Section */}
          <div className="status-section">
            <h3>Status</h3>
            <div className="status-item">
              <span className="status-label">Scraper Status:</span>
              <span className={`status-badge ${stats.isRunning ? 'running' : 'stopped'}`}>
                {stats.isRunning ? '🟢 Running' : '🔴 Stopped'}
              </span>
            </div>
            {stats.lastError && (
              <div className="status-item error">
                <span className="status-label">Last Error:</span>
                <span>{stats.lastError}</span>
              </div>
            )}
          </div>

          {/* Statistics Section */}
          <div className="stats-section">
            <h3>Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.totalRuns}</div>
                <div className="stat-label">Total Runs</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.successfulRuns}</div>
                <div className="stat-label">Successful</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.failedRuns}</div>
                <div className="stat-label">Failed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{successRate}%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.articlesThisCycle}</div>
                <div className="stat-label">Articles This Cycle</div>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="timeline-section">
            <h3>Timeline</h3>
            <div className="timeline-item">
              <span className="timeline-label">Last Run:</span>
              <span className="timeline-value">{formatDate(stats.lastRun)}</span>
            </div>
            <div className="timeline-item">
              <span className="timeline-label">Next Run:</span>
              <span className="timeline-value">{formatDate(stats.nextRun)}</span>
            </div>
          </div>

          {/* Controls Section */}
          <div className="controls-section">
            <h3>Controls</h3>
            <div className="control-buttons">
              <button 
                className="control-btn start-btn" 
                onClick={handleStart}
                disabled={loading || stats.isRunning}
              >
                {loading ? 'Starting...' : 'Start Scraper'}
              </button>
              <button 
                className="control-btn stop-btn" 
                onClick={handleStop}
                disabled={loading || !stats.isRunning}
              >
                {loading ? 'Stopping...' : 'Stop Scraper'}
              </button>
              <button 
                className="control-btn manual-btn" 
                onClick={handleManualScrape}
                disabled={manualRunning}
              >
                {manualRunning ? 'Running...' : '▶ Manual Scrape'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScraperDashboard;
