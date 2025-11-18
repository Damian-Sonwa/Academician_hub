/**
 * Remove duplicate lessons and ensure proper ordering
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course';
import Lesson from './models/Lesson';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evolve-hub';

async function removeDuplicates() {
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

    // Get all lessons
    const lessons = await Lesson.find({
      courseId: course._id.toString(),
    }).sort({ title: 1, createdAt: 1 });

    console.log(`📚 Found ${lessons.length} lessons\n`);

    // Group by title
    const lessonMap = new Map<string, any[]>();
    lessons.forEach(lesson => {
      const key = lesson.title;
      if (!lessonMap.has(key)) {
        lessonMap.set(key, []);
      }
      lessonMap.get(key)!.push(lesson);
    });

    // Find and remove duplicates (keep the most recent one)
    let deletedCount = 0;
    for (const [title, lessonList] of lessonMap.entries()) {
      if (lessonList.length > 1) {
        console.log(`⚠️  Found ${lessonList.length} duplicates for "${title}"`);
        // Sort by createdAt (most recent first)
        lessonList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        // Keep the first (most recent), delete the rest
        for (let i = 1; i < lessonList.length; i++) {
          await Lesson.deleteOne({ _id: lessonList[i]._id });
          console.log(`  ❌ Deleted duplicate: ${title} (created: ${lessonList[i].createdAt})`);
          deletedCount++;
        }
      }
    }

    if (deletedCount === 0) {
      console.log('✅ No duplicate lessons found');
    } else {
      console.log(`\n✅ Removed ${deletedCount} duplicate lessons`);
    }

    // Now fix the ordering
    const remainingLessons = await Lesson.find({
      courseId: course._id.toString(),
    }).sort({ createdAt: 1 });

    // Expected order based on curriculum
    const expectedOrder = [
      'Functions and Their Properties',
      'Calculus: Limits, Continuity, and Derivatives',
      'Applications of Derivatives: Optimization and Related Rates',
      'Integration Techniques and Applications',
      'Differential Equations',
      'Multivariable Calculus: Partial Derivatives and Multiple Integrals',
      'Linear Algebra: Vectors, Matrices, and Systems',
      'Eigenvalues, Eigenvectors, and Matrix Decompositions',
      'Discrete Mathematics: Sets, Logic, and Proofs',
      'Graph Theory and Combinatorics',
      'Number Theory: Prime Numbers and Modular Arithmetic',
      'Real Analysis: Sequences, Series, and Continuity',
      'Complex Analysis: Complex Numbers and Functions',
      'Probability Theory and Statistical Inference',
      'Mathematical Modeling and Applications',
      'Abstract Algebra: Groups, Rings, and Fields',
    ];

    console.log(`\n🔄 Fixing lesson order...\n`);

    for (let i = 0; i < expectedOrder.length; i++) {
      const lesson = remainingLessons.find(l => l.title === expectedOrder[i]);
      if (lesson) {
        if (lesson.order !== i + 1) {
          lesson.order = i + 1;
          await lesson.save();
          console.log(`  ✅ Set "${lesson.title}" to order ${i + 1}`);
        }
      }
    }

    // Show final order
    const finalLessons = await Lesson.find({
      courseId: course._id.toString(),
    }).sort({ order: 1 });

    console.log(`\n📚 Final lesson order:`);
    finalLessons.forEach((lesson) => {
      console.log(`   ${lesson.order}. ${lesson.title}`);
    });

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected');
  }
}

removeDuplicates();



