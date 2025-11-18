import mongoose, { Schema, Document } from 'mongoose';

interface ILetterItem {
  char: string;
  pronunciation: string;
  image: string;
}

interface INumberItem {
  char: string;
  text: string;
  pronunciation: string;
  image: string;
}

export interface IAlphabet extends Document {
  language: string;
  langCode: string; // Language code for TTS (e.g., 'es-ES', 'fr-FR', 'de-DE')
  letters: ILetterItem[];
  numbers: INumberItem[];
  description: string;
  specialNotes?: string;
  audioVerified?: boolean; // Whether pronunciation has been verified by native speakers
  createdAt: Date;
  updatedAt: Date;
}

const LetterItemSchema = new Schema({
  char: {
    type: String,
    required: true,
  },
  pronunciation: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const NumberItemSchema = new Schema({
  char: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  pronunciation: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const AlphabetSchema: Schema = new Schema(
  {
    language: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    langCode: {
      type: String,
      required: true,
      default: 'en-US',
      enum: ['es-ES', 'fr-FR', 'de-DE', 'en-US', 'en-GB', 'zh-CN', 'it-IT', 'pt-PT', 'ja-JP', 'ko-KR', 'ar-SA'],
    },
    letters: {
      type: [LetterItemSchema],
      required: true,
    },
    numbers: {
      type: [NumberItemSchema],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    specialNotes: {
      type: String,
    },
    audioVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAlphabet>('Alphabet', AlphabetSchema);

