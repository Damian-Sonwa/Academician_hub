import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  type: 'text' | 'system' | 'image' | 'file';
  metadata?: any;
  reactions: Array<{
    userId: string;
    emoji: string;
  }>;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({
  roomId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userAvatar: String,
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'system', 'image', 'file'],
    default: 'text',
  },
  metadata: Schema.Types.Mixed,
  reactions: [{
    userId: String,
    emoji: String,
  }],
  isEdited: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IMessage>('Message', MessageSchema);


