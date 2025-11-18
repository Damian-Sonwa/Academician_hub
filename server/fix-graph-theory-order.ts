/**
 * Fix Graph Theory and Combinatorics to be lesson 9
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

    // Find Graph Theory lesson
    const gtLesson = await Lesson.findOne({
      courseId: course._id.toString(),
      title: 'Graph Theory and Combinatorics',
    });

    if (gtLesson) {
      gtLesson.order = 9;
      await gtLesson.save();
      console.log('✅ Set "Graph Theory and Combinatorics" to order 9\n');
    } else {
      console.log('❌ Graph Theory and Combinatorics lesson not found\n');
    }

    // Show first 10 lessons
    const lessons = await Lesson.find({
      courseId: course._id.toString(),
    }).sort({ order: 1 }).limit(10);

    console.log('📚 First 10 lessons:');
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



