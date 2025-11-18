import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'social' | 'milestone' | 'special';
  xpReward: number;
  condition: {
    type: string;
    value: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['learning', 'social', 'milestone', 'special'],
    required: true,
  },
  xpReward: {
    type: Number,
    required: true,
  },
  condition: {
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common',
  },
}, {
  timestamps: true,
});

export default mongoose.model<IAchievement>('Achievement', AchievementSchema);


