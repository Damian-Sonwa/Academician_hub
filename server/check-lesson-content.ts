/**
 * Quick script to check lesson content in database
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from './models/Lesson';
import Course from './models/Course';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evolve-hub';

async function checkLesson() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find Mathematics Secondary course
    const course = await Course.findOne({
      title: /Mathematics.*Secondary/i,
    });

    if (!course) {
      console.log('❌ Course not found');
      return;
    }

    console.log(`📚 Course: ${course.title}\n`);

    // Find lesson at order 14
    const lesson = await Lesson.findOne({
      courseId: course._id.toString(),
      order: 14,
    });

    if (!lesson) {
      console.log('❌ Lesson not found');
      return;
    }

    console.log(`📖 Lesson Title: ${lesson.title}`);
    console.log(`📝 Description: ${lesson.description?.substring(0, 100)}...`);
    console.log(`📄 Content length: ${lesson.content?.length || 0} characters`);
    console.log(`\n📄 Content preview (first 500 chars):\n${lesson.content?.substring(0, 500)}...`);
    console.log(`\n🖼️  Main Image: ${lesson.imageUrl}`);
    console.log(`📚 Resources count: ${lesson.resources?.length || 0}`);
    console.log(`❓ Quiz questions: ${lesson.quiz?.questions?.length || 0}`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected');
  }
}

checkLesson();



