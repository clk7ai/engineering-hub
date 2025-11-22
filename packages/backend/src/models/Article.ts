import mongoose, { Document, Schema } from 'mongoose';
import { Article as IArticle, ArticleStatus } from '../../../shared/src/types';

export interface IArticleDocument extends Omit<IArticle, '_id'>, Document {}

const ArticleSchema = new Schema<IArticleDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  readTime: {
    type: Number,
    default: 5
  },
  source: {
    name: String,
    url: String,
    scrapedAt: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
ArticleSchema.index({ slug: 1 });
ArticleSchema.index({ category: 1, publishedAt: -1 });
ArticleSchema.index({ author: 1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ status: 1, isFeatured: -1, publishedAt: -1 });
ArticleSchema.index({ '$**': 'text' }); // Full-text search

// Virtual for URL
ArticleSchema.virtual('url').get(function() {
  return `/articles/${this.slug}`;
});

// Pre-save middleware
ArticleSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Calculate read time (average 200 words per minute)
    const words = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(words / 200);
  }
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IArticleDocument>('Article', ArticleSchema);
