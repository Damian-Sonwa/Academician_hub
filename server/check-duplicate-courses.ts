/**
 * Script to check for duplicate courses in the database
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evolve-hub';

async function checkDuplicates() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all courses
    const courses = await Course.find({}).sort({ title: 1, level: 1 });
    
    console.log(`📚 Total courses: ${courses.length}\n`);
    
    // Group by title and level
    const courseMap = new Map<string, any[]>();
    
    courses.forEach(course => {
      const key = `${course.title.toLowerCase()}_${course.level?.toLowerCase()}`;
      if (!courseMap.has(key)) {
        courseMap.set(key, []);
      }
      courseMap.get(key)!.push(course);
    });
    
    // Find duplicates
    const duplicates: Array<{ key: string; courses: any[] }> = [];
    courseMap.forEach((courseList, key) => {
      if (courseList.length > 1) {
        duplicates.push({ key, courses: courseList });
      }
    });
    
    if (duplicates.length > 0) {
      console.log(`⚠️  Found ${duplicates.length} duplicate course groups:\n`);
      duplicates.forEach(({ key, courses }) => {
        console.log(`\n📌 ${key}:`);
        courses.forEach((course, index) => {
          console.log(`   ${index + 1}. ID: ${course._id}, Title: ${course.title}, Level: ${course.level}, Category: ${course.category}, Enrolled: ${course.enrolled}`);
        });
      });
    } else {
      console.log('✅ No duplicates found!');
    }
    
    // Show all courses grouped by subject
    console.log('\n\n📊 All Courses by Subject:\n');
    const bySubject = new Map<string, any[]>();
    courses.forEach(course => {
      const subject = course.title.split(' - ')[0] || course.title;
      if (!bySubject.has(subject)) {
        bySubject.set(subject, []);
      }
      bySubject.get(subject)!.push(course);
    });
    
    bySubject.forEach((courseList, subject) => {
      console.log(`\n${subject}:`);
      courseList.forEach(course => {
        console.log(`  - ${course.title} (Level: ${course.level}, Category: ${course.category})`);
      });
    });
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected');
  }
}

checkDuplicates();



