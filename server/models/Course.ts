import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: string;
  duration: string;
  enrolled: number;
  imageUrl?: string;
  isPremium: boolean;
  textbookTitle?: string;
  textbookUrl?: string;
  textbookLicense?: string;
  textbookAttribution?: string;
  textbookAuthor?: string;
  textbookSource?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, required: true, enum: ['Junior', 'Secondary', 'Advanced'] },
    instructor: { type: String, required: true },
    duration: { type: String, default: '6 weeks' },
    enrolled: { type: Number, default: 0 },
    imageUrl: { type: String },
    isPremium: { type: Boolean, default: false },
    textbookTitle: { type: String },
    textbookUrl: { type: String },
    textbookLicense: { type: String },
    textbookAttribution: { type: String },
    textbookAuthor: { type: String },
    textbookSource: { type: String, default: 'OpenTextbook' },
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>('Course', CourseSchema);

