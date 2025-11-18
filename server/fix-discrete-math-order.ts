/**
 * Fix Discrete Mathematics to be lesson 8
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course';
import Lesson from './models/Lesson';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evolve-hub';

async function fixOrder() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find Mathematics Advanced course
    const course = await Course.findOne({
      title: /Mathematics.*Advanced/i,
    });

    if (!course) {
      console.log('❌ Mathematics Advanced course not found');
      return;
    }

    // Find Discrete Mathematics lesson
    const dmLesson = await Lesson.findOne({
      courseId: course._id.toString(),
      title: 'Discrete Mathematics: Sets, Logic, and Proofs',
    });

    if (dmLesson) {
      dmLesson.order = 8;
      await dmLesson.save();
      console.log('✅ Set "Discrete Mathematics: Sets, Logic, and Proofs" to order 8\n');
    } else {
      console.log('❌ Discrete Mathematics lesson not found\n');
    }

    // Show first 9 lessons
    const lessons = await Lesson.find({
      courseId: course._id.toString(),
    }).sort({ order: 1 }).limit(9);

    console.log('📚 First 9 lessons:');
    lessons.forEach((lesson) => {
      console.log(`   ${lesson.order}. ${lesson.title}`);
    });

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected');
  }
}

fixOrder();



