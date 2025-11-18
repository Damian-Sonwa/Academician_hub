import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  userId: string;
  courseId?: string;
  title: string;
  description: string;
  content: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  grade?: number;
  feedback?: string;
  submittedAt?: Date;
  gradedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  courseId: {
    type: String,
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
  technologies: {
    type: [String],
    default: [],
  },
  imageUrl: String,
  demoUrl: String,
  repoUrl: String,
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft',
  },
  grade: {
    type: Number,
    min: 0,
    max: 100,
  },
  feedback: String,
  submittedAt: Date,
  gradedAt: Date,
}, {
  timestamps: true,
});

export default mongoose.model<IProject>('Project', ProjectSchema);

