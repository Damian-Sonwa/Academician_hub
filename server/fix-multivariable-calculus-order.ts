/**
 * Fix Multivariable Calculus to be lesson 5
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

    // Find Multivariable Calculus lesson
    const mvLesson = await Lesson.findOne({
      courseId: course._id.toString(),
      title: 'Multivariable Calculus: Partial Derivatives and Multiple Integrals',
    });

    if (mvLesson) {
      mvLesson.order = 5;
      await mvLesson.save();
      console.log('✅ Set "Multivariable Calculus: Partial Derivatives and Multiple Integrals" to order 5\n');
    } else {
      console.log('❌ Multivariable Calculus lesson not found\n');
    }

    // Show first 6 lessons
    const lessons = await Lesson.find({
      courseId: course._id.toString(),
    }).sort({ order: 1 }).limit(6);

    console.log('📚 First 6 lessons:');
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



