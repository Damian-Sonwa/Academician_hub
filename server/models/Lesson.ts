import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
  courseId: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
  week?: number; // Week number for weekly content structure
  resources: string[];
  imageUrl?: string; // Main illustration image
  images?: string[]; // Additional educational images
  assignments?: Array<{
    title: string;
    description: string;
    tasks: string[];
  }>;
  quiz?: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema({
  courseId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  videoUrl: String,
  imageUrl: String, // Main illustration for the lesson
  images: [String], // Additional educational images
  duration: {
    type: Number,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  week: Number, // Week number for weekly content
  resources: [String],
  assignments: [{
    title: String,
    description: String,
    tasks: [String],
  }],
  quiz: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
    }],
  },
}, {
  timestamps: true,
});

export default mongoose.model<ILesson>('Lesson', LessonSchema);


