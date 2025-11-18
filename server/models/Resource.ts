import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'article' | 'code' | 'link';
  url: string;
  category: string;
  tags: string[];
  courseId?: string;
  lessonId?: string;
  downloads: number;
  views: number;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['pdf', 'video', 'article', 'code', 'link'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: [String],
  courseId: String,
  lessonId: String,
  downloads: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  uploadedBy: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IResource>('Resource', ResourceSchema);


