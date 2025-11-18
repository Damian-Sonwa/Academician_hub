/**
 * Verify that Functions and Their Properties is lesson 1 for Mathematics Advanced
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course';
import Lesson from './models/Lesson';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evolve-hub';

async function verifyLesson1() {
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

    console.log(`📚 Course: ${course.title}\n`);

    // Find lesson with order 1
    const lesson1 = await Lesson.findOne({
      courseId: course._id.toString(),
      order: 1,
    });

    if (!lesson1) {
      console.log('❌ Lesson 1 not found');
      return;
    }

    console.log(`📖 Lesson 1:`);
    console.log(`   Title: ${lesson1.title}`);
    console.log(`   Order: ${lesson1.order}`);
    console.log(`   Description: ${lesson1.description?.substring(0, 100)}...`);
    console.log(`   Content length: ${lesson1.content?.length || 0} characters`);
    console.log(`   Image: ${lesson1.imageUrl ? '✓' : '✗'}`);
    console.log(`   Quiz questions: ${lesson1.quiz?.questions?.length || 0}`);
    console.log(`   Assignments: ${lesson1.assignments?.length || 0}`);

    if (lesson1.title === 'Functions and Their Properties') {
      console.log(`\n✅ SUCCESS: Functions and Their Properties is correctly set as lesson 1!`);
    } else {
      console.log(`\n⚠️  WARNING: Lesson 1 is "${lesson1.title}", not "Functions and Their Properties"`);
    }

    // Show first 3 lessons
    const firstLessons = await Lesson.find({
      courseId: course._id.toString(),
    })
      .sort({ order: 1 })
      .limit(3);

    console.log(`\n📚 First 3 lessons:`);
    firstLessons.forEach((lesson, index) => {
      console.log(`   ${index + 1}. ${lesson.title} (Order: ${lesson.order})`);
    });

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected');
  }
}

verifyLesson1();



