import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement';
  isRead: boolean;
  link?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'achievement'],
    default: 'info',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  link: String,
  icon: String,
}, {
  timestamps: true,
});

// Index for efficient queries
NotificationSchema.index({ userId: 1, isRead: 1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);

