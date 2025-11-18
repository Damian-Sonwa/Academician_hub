import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignmentQuestion {
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: string[]; // For multiple choice
  correctAnswer: string | string[]; // For multiple choice/essay
  points: number;
  explanation?: string;
}

export interface IAssignment extends Document {
  lessonId: string;
  courseId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'advanced';
  duration: number; // minutes
  totalPoints: number;
  passingScore: number; // percentage
  questions: IAssignmentQuestion[];
  instructions: string[];
  isOptional: boolean;
  unlockLessonId?: string; // Next lesson ID that gets unlocked upon completion
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentQuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
    required: true,
  },
  options: [String],
  correctAnswer: Schema.Types.Mixed, // Can be string or array
  points: {
    type: Number,
    required: true,
    default: 1,
  },
  explanation: String,
});

const AssignmentSchema = new Schema(
  {
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'advanced'],
      required: true,
      default: 'medium',
    },
    duration: {
      type: Number,
      required: true,
      default: 10, // minutes
    },
    totalPoints: {
      type: Number,
      required: true,
      default: 10,
    },
    passingScore: {
      type: Number,
      required: true,
      default: 70, // 70%
    },
    questions: {
      type: [AssignmentQuestionSchema],
      required: true,
    },
    instructions: [String],
    isOptional: {
      type: Boolean,
      default: false,
    },
    unlockLessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
    },
  },
  { timestamps: true }
);

// Index for fast lookups
AssignmentSchema.index({ lessonId: 1 });
AssignmentSchema.index({ courseId: 1 });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);

