import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentLesson: string;
  progress: number; // percentage 0-100
  xpEarned: number;
  timeSpent: number; // in minutes
  lastAccessed: Date;
  quizScores: Array<{
    lessonId: string;
    score: number;
    attemptedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  courseId: {
    type: String,
    required: true,
    index: true,
  },
  completedLessons: [String],
  currentLesson: String,
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  xpEarned: {
    type: Number,
    default: 0,
  },
  timeSpent: {
    type: Number,
    default: 0,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
  quizScores: [{
    lessonId: String,
    score: Number,
    attemptedAt: Date,
  }],
}, {
  timestamps: true,
});

// Compound index for user-course queries
ProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<IProgress>('Progress', ProgressSchema);


