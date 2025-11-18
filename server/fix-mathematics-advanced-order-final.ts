/**
 * Fix the order of Mathematics Advanced lessons - ensure all lessons are properly ordered
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

    // Expected order based on curriculum
    const expectedOrder = [
      'Functions and Their Properties',
      'Limits and Continuity',
      'Applications of Derivatives: Optimization and Related Rates',
      'Calculus: Limits, Continuity, and Derivatives',
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

    console.log('🔄 Fixing lesson order...\n');

    for (let i = 0; i < expectedOrder.length; i++) {
      const lesson = await Lesson.findOne({
        courseId: course._id.toString(),
        title: expectedOrder[i],
      });
      
      if (lesson) {
        if (lesson.order !== i + 1) {
          lesson.order = i + 1;
          await lesson.save();
          console.log(`  ✅ Set "${lesson.title}" to order ${i + 1}`);
        }
      } else {
        console.log(`  ⚠️  Lesson not found: "${expectedOrder[i]}"`);
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

fixOrder();



