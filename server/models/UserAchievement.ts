import mongoose, { Schema, Document } from 'mongoose';

export interface IUserAchievement extends Document {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserAchievementSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  achievementId: {
    type: String,
    required: true,
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate achievements
UserAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export default mongoose.model<IUserAchievement>('UserAchievement', UserAchievementSchema);


