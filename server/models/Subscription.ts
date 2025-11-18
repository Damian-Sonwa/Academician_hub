import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: string;
  plan: 'free' | 'premium' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod?: string;
  amount: number;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  plan: {
    type: String,
    enum: ['free', 'premium', 'pro'],
    default: 'free',
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  autoRenew: {
    type: Boolean,
    default: false,
  },
  paymentMethod: String,
  amount: {
    type: Number,
    default: 0,
  },
  features: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

