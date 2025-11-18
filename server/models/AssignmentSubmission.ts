import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswerSubmission {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
}

export interface IAssignmentSubmission extends Document {
  userId: string;
  assignmentId: string;
  lessonId: string;
  courseId: string;
  answers: IAnswerSubmission[];
  totalScore: number;
  totalPoints: number;
  percentageScore: number;
  isPassed: boolean;
  submittedAt: Date;
  gradedAt?: Date;
  feedback?: string;
  timeSpent: number; // minutes
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSubmissionSchema = new Schema({
  questionId: {
    type: String,
    required: true,
  },
  answer: Schema.Types.Mixed,
  isCorrect: {
    type: Boolean,
    required: true,
  },
  pointsEarned: {
    type: Number,
    required: true,
  },
});

const AssignmentSubmissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
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
    answers: {
      type: [AnswerSubmissionSchema],
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    totalPoints: {
      type: Number,
      required: true,
    },
    percentageScore: {
      type: Number,
      required: true,
    },
    isPassed: {
      type: Boolean,
      required: true,
      default: false,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: Date,
    feedback: String,
    timeSpent: {
      type: Number,
      default: 0, // minutes
    },
  },
  { timestamps: true }
);

// Indexes
AssignmentSubmissionSchema.index({ userId: 1, assignmentId: 1 });
AssignmentSubmissionSchema.index({ lessonId: 1 });
AssignmentSubmissionSchema.index({ courseId: 1 });

export default mongoose.model<IAssignmentSubmission>(
  'AssignmentSubmission',
  AssignmentSubmissionSchema
);

