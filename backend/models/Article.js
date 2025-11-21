const mongoose = require('mongoose');

/**
 * Article Schema for aggregated news articles
 * Stores articles scraped from various news sources
 */
const articleSchema = new mongoose.Schema({
  // Article content
  title: {
    type: String,
    required: true,
    index: true,
    maxlength: 500
  },
  description: {
    type: String,
    maxlength: 5000
  },
  content: {
    type: String,
    maxlength: 50000
  },
  
  // Media
  image: {
    type: String,
    default: null
  },
  
  // Attribution & Source
  source: {
    type: String,
    required: true,
    index: true
  },
  sourceUrl: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: String,
    default: null
  },
  
  // Categorization
  category: {
    type: String,
    enum: ['innovation', 'science', 'culture', 'health', 'transportation', 'military', 'energy', 'other'],
    default: 'other',
    index: true
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  
  // ML/Analytics fields
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: null
  },
  relevanceScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  readingTime: {
    type: Number,
    default: null
  },
  
  // Tracking
  publishDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  addedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Status
  isAggregated: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  
  // Engagement metrics
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for common queries
articleSchema.index({ source: 1, publishDate: -1 });
articleSchema.index({ category: 1, isActive: 1, publishDate: -1 });
articleSchema.index({ relevanceScore: -1, publishDate: -1 });

// TTL index: Auto-delete articles after 90 days if archived
articleSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 7776000, partialFilterExpression: { isArchived: true } }
);

// Methods
articleSchema.methods.archive = function() {
  this.isArchived = true;
  this.isActive = false;
  return this.save();
};

articleSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

articleSchema.methods.updateSentiment = function(sentiment) {
  this.sentiment = sentiment;
  return this.save();
};

// Static methods
articleSchema.statics.getByCategory = function(category, limit = 50) {
  return this.find(
    { category, isActive: true },
    null,
    { sort: { publishDate: -1 }, limit }
  );
};

articleSchema.statics.getBySource = function(source, limit = 50) {
  return this.find(
    { source, isActive: true },
    null,
    { sort: { publishDate: -1 }, limit }
  );
};

articleSchema.statics.getTrending = function(days = 7, limit = 20) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find(
    { publishDate: { $gte: startDate }, isActive: true },
    null,
    { sort: { relevanceScore: -1, views: -1 }, limit }
  );
};

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
