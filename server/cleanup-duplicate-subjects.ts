/**
 * Script to remove duplicate subjects and keep only canonical courses
 * - Academic subjects: Only "Subject - Secondary" and "Subject - Advanced"
 * - Languages: Only "Language - Beginner", "Language - Intermediate", "Language - Advanced"
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course';
import Lesson from './models/Lesson';
import Progress from './models/Progress';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evolve-hub';

// Canonical course titles to KEEP
const CANONICAL_COURSES = [
  // Academic Subjects - Secondary and Advanced only
  'Mathematics - Secondary',
  'Mathematics - Advanced',
  'Biology - Secondary',
  'Biology - Advanced',
  'Chemistry - Secondary',
  'Chemistry - Advanced',
  'Physics - Secondary',
  'Physics - Advanced',
  'English - Secondary',
  'English - Advanced',
  'History - Secondary',
  'History - Advanced',
  'Geography - Secondary',
  'Geography - Advanced',
  'Webdevelopment - Secondary',
  'Webdevelopment - Advanced',
  'Python - Secondary',
  'Python - Advanced',
  'Cybersecurity - Secondary',
  'Cybersecurity - Advanced',
  
  // Languages - Junior (will be Beginner), Secondary (will be Intermediate), Advanced
  'French - Junior',
  'French - Secondary',
  'French - Advanced',
  'German - Junior',
  'German - Secondary',
  'German - Advanced',
  'Italian - Junior',
  'Italian - Secondary',
  'Italian - Advanced',
  'Spanish - Junior',
  'Spanish - Secondary',
  'Spanish - Advanced',
  'Chinese - Junior',
  'Chinese - Secondary',
  'Chinese - Advanced',
  'Japanese - Junior',
  'Japanese - Secondary',
  'Japanese - Advanced',
  'Arabic - Junior',
  'Arabic - Secondary',
  'Arabic - Advanced',
];

async function cleanupDuplicateSubjects() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const allCourses = await Course.find({}).sort({ title: 1 });
    console.log(`📚 Total courses found: ${allCourses.length}\n`);

    const coursesToDelete: any[] = [];
    const coursesToKeep: any[] = [];

    for (const course of allCourses) {
      if (CANONICAL_COURSES.includes(course.title)) {
        coursesToKeep.push(course);
      } else {
        coursesToDelete.push(course);
      }
    }

    console.log(`✅ Courses to keep: ${coursesToKeep.length}`);
    console.log(`🗑️  Courses to delete: ${coursesToDelete.length}\n`);

    if (coursesToDelete.length === 0) {
      console.log('✅ No duplicate subjects found. All courses are canonical.\n');
      // Show current structure
      const bySubject = new Map<string, any[]>();
      coursesToKeep.forEach(course => {
        const subject = course.title.split(' - ')[0] || course.title;
        if (!bySubject.has(subject)) {
          bySubject.set(subject, []);
        }
        bySubject.get(subject)!.push(course);
      });
      
      bySubject.forEach((courseList, subject) => {
        console.log(`${subject}:`);
        courseList.forEach(course => {
          console.log(`  - ${course.title} (Level: ${course.level})`);
        });
      });
      
      await mongoose.disconnect();
      return;
    }

    console.log('🗑️  Deleting duplicate subjects:\n');
    let deletedCount = 0;
    let deletedLessons = 0;
    let deletedProgress = 0;

    for (const course of coursesToDelete) {
      console.log(`  ❌ ${course.title} (${course.level})`);
      
      // Delete associated lessons
      const lessons = await Lesson.find({ courseId: course._id.toString() });
      if (lessons.length > 0) {
        await Lesson.deleteMany({ courseId: course._id.toString() });
        deletedLessons += lessons.length;
        console.log(`     - Deleted ${lessons.length} lessons`);
      }
      
      // Delete associated progress
      const progress = await Progress.find({ courseId: course._id.toString() });
      if (progress.length > 0) {
        await Progress.deleteMany({ courseId: course._id.toString() });
        deletedProgress += progress.length;
        console.log(`     - Deleted ${progress.length} progress records`);
      }
      
      await Course.deleteOne({ _id: course._id });
      deletedCount++;
    }

    console.log(`\n✅ Cleanup complete!`);
    console.log(`  - Deleted ${deletedCount} duplicate courses`);
    console.log(`  - Deleted ${deletedLessons} associated lessons`);
    console.log(`  - Deleted ${deletedProgress} associated progress records`);
    console.log(`  - Kept ${coursesToKeep.length} canonical courses\n`);

    // Show final structure
    const remainingCourses = await Course.find({}).sort({ title: 1 });
    console.log(`📊 Final Course Structure (${remainingCourses.length} courses):\n`);
    
    const bySubject = new Map<string, any[]>();
    remainingCourses.forEach(course => {
      const subject = course.title.split(' - ')[0] || course.title;
      if (!bySubject.has(subject)) {
        bySubject.set(subject, []);
      }
      bySubject.get(subject)!.push(course);
    });
    
    bySubject.forEach((courseList, subject) => {
      console.log(`${subject}:`);
      courseList.forEach(course => {
        console.log(`  - ${course.title} (Level: ${course.level})`);
      });
    });

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected');
  }
}

cleanupDuplicateSubjects();



