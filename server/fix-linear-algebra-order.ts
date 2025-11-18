/**
 * Fix Linear Algebra to be lesson 6
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

    // Find Linear Algebra lesson
    const laLesson = await Lesson.findOne({
      courseId: course._id.toString(),
      title: 'Linear Algebra: Vectors, Matrices, and Systems',
    });

    if (laLesson) {
      laLesson.order = 6;
      await laLesson.save();
      console.log('✅ Set "Linear Algebra: Vectors, Matrices, and Systems" to order 6\n');
    } else {
      console.log('❌ Linear Algebra lesson not found\n');
    }

    // Show first 7 lessons
    const lessons = await Lesson.find({
      courseId: course._id.toString(),
    }).sort({ order: 1 }).limit(7);

    console.log('📚 First 7 lessons:');
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



