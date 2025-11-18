/**
 * Script to remove duplicate courses and standardize course structure
 * - Academic subjects: Only Secondary and Advanced
 * - Languages: Only Beginner, Intermediate, and Advanced
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course';
import Lesson from './models/Lesson';
import Progress from './models/Progress';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evolve-hub';

// Language categories
const LANGUAGE_CATEGORIES = ['languages'];
const LANGUAGE_SUBJECTS = ['french', 'german', 'italian', 'spanish', 'chinese', 'japanese', 'arabic'];

// Academic subjects that should only have Secondary and Advanced
const ACADEMIC_SUBJECTS = [
  'mathematics', 'math',
  'biology', 'chemistry', 'physics', 'science',
  'english',
  'history', 'geography',
  'webdevelopment', 'webdev',
  'python',
  'cybersecurity'
];

// Courses to keep (canonical names)
const KEEP_COURSES = [
  // Mathematics
  'Mathematics - Secondary',
  'Mathematics - Advanced',
  
  // Biology
  'Biology - Secondary',
  'Biology - Advanced',
  
  // Chemistry
  'Chemistry - Secondary',
  'Chemistry - Advanced',
  
  // Physics
  'Physics - Secondary',
  'Physics - Advanced',
  
  // English
  'English - Secondary',
  'English - Advanced',
  
  // History
  'History - Secondary',
  'History - Advanced',
  
  // Geography
  'Geography - Secondary',
  'Geography - Advanced',
  
  // Web Development
  'Webdevelopment - Secondary',
  'Webdevelopment - Advanced',
  
  // Python
  'Python - Secondary',
  'Python - Advanced',
  
  // Cybersecurity
  'Cybersecurity - Secondary',
  'Cybersecurity - Advanced',
  
  // Languages - Beginner, Intermediate, Advanced
  'French - Junior', // Will be renamed to Beginner
  'French - Secondary', // Will be renamed to Intermediate
  'French - Advanced',
  
  'German - Junior', // Will be renamed to Beginner
  'German - Secondary', // Will be renamed to Intermediate
  'German - Advanced',
  
  'Italian - Junior', // Will be renamed to Beginner
  'Italian - Secondary', // Will be renamed to Intermediate
  'Italian - Advanced',
  
  'Spanish - Junior', // Will be renamed to Beginner
  'Spanish - Secondary', // Will be renamed to Intermediate
  'Spanish - Advanced',
  
  'Chinese - Junior', // Will be renamed to Beginner
  'Chinese - Secondary', // Will be renamed to Intermediate
  'Chinese - Advanced',
  
  'Japanese - Junior', // Will be renamed to Beginner
  'Japanese - Secondary', // Will be renamed to Intermediate
  'Japanese - Advanced',
  
  'Arabic - Junior', // Will be renamed to Beginner
  'Arabic - Secondary', // Will be renamed to Intermediate
  'Arabic - Advanced',
];

function isLanguageCourse(course: any): boolean {
  const titleLower = course.title.toLowerCase();
  const categoryLower = course.category?.toLowerCase() || '';
  
  return LANGUAGE_CATEGORIES.includes(categoryLower) || 
         LANGUAGE_SUBJECTS.some(lang => titleLower.includes(lang));
}

function isAcademicCourse(course: any): boolean {
  const titleLower = course.title.toLowerCase();
  const categoryLower = course.category?.toLowerCase() || '';
  
  return ACADEMIC_SUBJECTS.some(subject => 
    titleLower.includes(subject) || categoryLower.includes(subject)
  );
}

function shouldKeepCourse(course: any): boolean {
  const title = course.title;
  
  // Check if it's in the keep list
  if (KEEP_COURSES.includes(title)) {
    return true;
  }
  
  // For languages, check if it matches the pattern
  if (isLanguageCourse(course)) {
    const match = title.match(/^(French|German|Italian|Spanish|Chinese|Japanese|Arabic)\s*-\s*(Junior|Secondary|Advanced)$/i);
    return !!match;
  }
  
  // For academic subjects, check if it matches the pattern
  if (isAcademicCourse(course)) {
    const match = title.match(/^(Mathematics|Biology|Chemistry|Physics|English|History|Geography|Webdevelopment|Python|Cybersecurity)\s*-\s*(Secondary|Advanced)$/i);
    return !!match;
  }
  
  return false;
}

async function cleanupCourses() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const allCourses = await Course.find({}).sort({ title: 1 });
    console.log(`📚 Total courses found: ${allCourses.length}\n`);

    const coursesToDelete: any[] = [];
    const coursesToUpdate: any[] = [];

    for (const course of allCourses) {
      if (!shouldKeepCourse(course)) {
        coursesToDelete.push(course);
      } else {
        // Check if level needs to be updated
        if (isLanguageCourse(course)) {
          if (course.level === 'Junior') {
            // Keep Junior for now, we'll rename it later
            coursesToUpdate.push({ course, newLevel: 'Junior' }); // Will be renamed to Beginner
          }
        } else if (isAcademicCourse(course)) {
          if (course.level === 'Junior') {
            // Academic subjects shouldn't have Junior - delete it
            coursesToDelete.push(course);
          }
        }
      }
    }

    console.log(`🗑️  Courses to delete: ${coursesToDelete.length}`);
    console.log(`🔄 Courses to update: ${coursesToUpdate.length}\n`);

    // Delete duplicate/incorrect courses
    let deletedCount = 0;
    for (const course of coursesToDelete) {
      console.log(`  Deleting: ${course.title} (${course.level})`);
      
      // Delete associated lessons
      const lessons = await Lesson.find({ courseId: course._id.toString() });
      if (lessons.length > 0) {
        await Lesson.deleteMany({ courseId: course._id.toString() });
        console.log(`    - Deleted ${lessons.length} lessons`);
      }
      
      // Delete associated progress
      const progress = await Progress.find({ courseId: course._id.toString() });
      if (progress.length > 0) {
        await Progress.deleteMany({ courseId: course._id.toString() });
        console.log(`    - Deleted ${progress.length} progress records`);
      }
      
      await Course.deleteOne({ _id: course._id });
      deletedCount++;
    }

    console.log(`\n✅ Deleted ${deletedCount} courses\n`);

    // Update course levels for languages (Junior → Beginner, Secondary → Intermediate)
    let updatedCount = 0;
    for (const { course, newLevel } of coursesToUpdate) {
      if (isLanguageCourse(course)) {
        let updateLevel = course.level;
        if (course.level === 'Junior') {
          updateLevel = 'Junior'; // Keep as Junior for now, will be handled by level mapping
        }
        // For now, just log - we'll handle level renaming separately
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`  - Deleted: ${deletedCount} courses`);
    console.log(`  - Remaining: ${allCourses.length - deletedCount} courses`);

    // Show remaining courses
    const remainingCourses = await Course.find({}).sort({ title: 1 });
    console.log(`\n📚 Remaining courses (${remainingCourses.length}):\n`);
    
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

cleanupCourses();



