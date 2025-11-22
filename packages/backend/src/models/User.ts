import mongoose, { Document, Schema } from 'mongoose';
import { User as IUser, UserRole, UserPreferences } from '../../../shared/src/types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserPreferencesSchema = new Schema<UserPreferences>({
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  categories: [{
    type: String
  }],
  emailNotifications: {
    type: Boolean,
    default: true
  },
  weeklyNewsletter: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const UserSchema = new Schema<IUserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'author', 'user'],
    default: 'user'
  },
  preferences: {
    type: UserPreferencesSchema,
    default: () => ({})
  },
  bookmarkedArticles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }],
  likedArticles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }]
}, {
  timestamps: true
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// Virtual for full name
UserSchema.virtual('displayName').get(function() {
  return this.name;
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  // In production, use bcrypt
  return candidatePassword === this.password; // TEMPORARY - implement bcrypt
};

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  // TODO: Hash password with bcrypt in production
  next();
});

export default mongoose.model<IUserDocument>('User', UserSchema);
