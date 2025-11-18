/**
 * Weekly Progress Model - Tracks completion of weekly topics
 * Ensures sequential learning: users must complete current week before accessing next
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IWeeklyProgress extends Document {
  userId: string;
  courseId: string;
  level: string; // beginner, intermediate, advanced
  week: number; // Week number (1, 2, 3, ...)
  topic: string; // Topic title
  status: 'locked' | 'unlocked' | 'in-progress' | 'completed';
  assignmentsCompleted: number; // Number of assignments completed
  totalAssignments: number; // Total assignments for this week
  quizzesCompleted: number; // Number of quizzes completed
  totalQuizzes: number; // Total quizzes for this week
  quizScores: Array<{
    quizIndex: number;
    score: number; // Percentage score
    completedAt: Date;
  }>;
  assignmentSubmissions: Array<{
    assignmentIndex: number;
    submittedAt: Date;
    status: 'submitted' | 'graded';
    grade?: number;
  }>;
  unlockedAt?: Date; // When this week was unlocked
  startedAt?: Date; // When user started this week
  completedAt?: Date; // When user completed all assignments and quizzes
  createdAt: Date;
  updatedAt: Date;
}

const WeeklyProgressSchema = new Schema({
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
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'basic', 'secondary'],
  },
  week: {
    type: Number,
    required: true,
    min: 1,
  },
  topic: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['locked', 'unlocked', 'in-progress', 'completed'],
    default: 'locked',
  },
  assignmentsCompleted: {
    type: Number,
    default: 0,
  },
  totalAssignments: {
    type: Number,
    required: true,
    default: 0,
  },
  quizzesCompleted: {
    type: Number,
    default: 0,
  },
  totalQuizzes: {
    type: Number,
    required: true,
    default: 0,
  },
  quizScores: [{
    quizIndex: Number,
    score: Number,
    completedAt: Date,
  }],
  assignmentSubmissions: [{
    assignmentIndex: Number,
    submittedAt: Date,
    status: {
      type: String,
      enum: ['submitted', 'graded'],
      default: 'submitted',
    },
    grade: Number,
  }],
  unlockedAt: Date,
  startedAt: Date,
  completedAt: Date,
}, {
  timestamps: true,
});

// Compound index for efficient queries
WeeklyProgressSchema.index({ userId: 1, courseId: 1, level: 1, week: 1 }, { unique: true });

export default mongoose.model<IWeeklyProgress>('WeeklyProgress', WeeklyProgressSchema);



