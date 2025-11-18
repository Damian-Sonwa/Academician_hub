import mongoose, { Schema, Document } from 'mongoose';

export interface IDictionary extends Document {
  word: string;
  language: string;
  meaning: string;
  pronunciation?: string; // IPA notation
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  audioUrl?: string; // URL to audio pronunciation
  partOfSpeech?: string; // noun, verb, adjective, etc.
  createdAt: Date;
  updatedAt: Date;
}

const DictionarySchema: Schema = new Schema(
  {
    word: {
      type: String,
      required: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['english', 'french', 'german', 'italian', 'spanish', 'chinese', 'japanese', 'arabic'],
      index: true,
    },
    meaning: {
      type: String,
      required: true,
    },
    pronunciation: {
      type: String, // IPA notation
    },
    examples: [{
      type: String,
    }],
    synonyms: [{
      type: String,
    }],
    antonyms: [{
      type: String,
    }],
    audioUrl: {
      type: String, // URL to audio pronunciation
    },
    partOfSpeech: {
      type: String,
      enum: ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection'],
    },
  },
  { timestamps: true }
);

// Compound index for efficient searching
DictionarySchema.index({ word: 1, language: 1 }, { unique: true });
DictionarySchema.index({ language: 1, word: 1 });

export default mongoose.model<IDictionary>('Dictionary', DictionarySchema);



