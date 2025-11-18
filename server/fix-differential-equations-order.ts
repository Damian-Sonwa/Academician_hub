/**
 * Fix Differential Equations to be lesson 4
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

    // Find Differential Equations lesson
    const deLesson = await Lesson.findOne({
      courseId: course._id.toString(),
      title: 'Differential Equations',
    });

    if (deLesson) {
      deLesson.order = 4;
      await deLesson.save();
      console.log('✅ Set "Differential Equations" to order 4\n');
    } else {
      console.log('❌ Differential Equations lesson not found\n');
    }

    // Show first 5 lessons
    const lessons = await Lesson.find({
      courseId: course._id.toString(),
    }).sort({ order: 1 }).limit(5);

    console.log('📚 First 5 lessons:');
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



