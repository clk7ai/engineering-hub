import mongoose, { Document, Schema } from 'mongoose';
import { Category as ICategory } from '../../../shared/src/types';

export interface ICategoryDocument extends Omit<ICategory, '_id'>, Document {}

const CategorySchema = new Schema<ICategoryDocument>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: 200
  },
  icon: {
    type: String
  },
  color: {
    type: String,
    default: '#0A7FBF'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ order: 1 });

export default mongoose.model<ICategoryDocument>('Category', CategorySchema);
