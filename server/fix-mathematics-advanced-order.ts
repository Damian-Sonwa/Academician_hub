/**
 * Fix the order of Mathematics Advanced lessons
 * Ensure Functions and Their Properties is lesson 1
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

    // Get all lessons for this course
    const lessons = await Lesson.find({
      courseId: course._id.toString(),
    }).sort({ order: 1, createdAt: 1 });

    console.log(`📚 Found ${lessons.length} lessons\n`);

    // Find Functions and Their Properties
    const functionsLesson = lessons.find(l => l.title === 'Functions and Their Properties');
    const calculusLesson = lessons.find(l => l.title === 'Calculus: Limits, Continuity, and Derivatives');

    if (functionsLesson && calculusLesson) {
      // Set Functions as order 1
      functionsLesson.order = 1;
      await functionsLesson.save();
      console.log(`✅ Set "Functions and Their Properties" to order 1`);

      // Set Calculus as order 2
      calculusLesson.order = 2;
      await calculusLesson.save();
      console.log(`✅ Set "Calculus: Limits, Continuity, and Derivatives" to order 2`);

      // Update all other lessons to shift by 1 if needed
      for (const lesson of lessons) {
        if (lesson.title !== 'Functions and Their Properties' && 
            lesson.title !== 'Calculus: Limits, Continuity, and Derivatives' &&
            lesson.order >= 1) {
          const newOrder = lesson.order + 1;
          if (lesson.order !== newOrder) {
            lesson.order = newOrder;
            await lesson.save();
            console.log(`  🔄 Updated "${lesson.title}" to order ${newOrder}`);
          }
        }
      }
    } else if (functionsLesson) {
      // Just ensure Functions is order 1
      if (functionsLesson.order !== 1) {
        functionsLesson.order = 1;
        await functionsLesson.save();
        console.log(`✅ Set "Functions and Their Properties" to order 1`);
      }
    }

    // Show final order
    const finalLessons = await Lesson.find({
      courseId: course._id.toString(),
    }).sort({ order: 1 });

    console.log(`\n📚 Final lesson order (first 5):`);
    finalLessons.slice(0, 5).forEach((lesson, index) => {
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



