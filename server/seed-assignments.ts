import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Assignment from './models/Assignment';
import Course from './models/Course';
import Lesson from './models/Lesson';
import { createAssignmentForLesson } from './utils/assignmentGenerator';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elearners';

async function seedAssignments() {
  try {
    console.log('🌱 Starting assignment seeding process...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing assignments
    await Assignment.deleteMany({});
    console.log('🗑️  Cleared existing assignments');

    // Get all courses
    const courses = await Course.find();
    console.log(`📚 Found ${courses.length} courses`);

    let totalAssignments = 0;

    for (const course of courses) {
      const lessons = await Lesson.find({ courseId: course._id.toString() }).sort({ order: 1 });
      console.log(`\n📝 Processing ${course.title}:`);
      console.log(`   Found ${lessons.length} lessons`);

      for (const lesson of lessons) {
        try {
          const assignment = await createAssignmentForLesson(
            lesson._id.toString(),
            course._id.toString()
          );
          totalAssignments++;
          console.log(`   ✅ Created assignment for Lesson ${lesson.order}: ${lesson.title}`);
        } catch (error: any) {
          console.error(`   ❌ Error creating assignment for lesson ${lesson.order}:`, error.message);
        }
      }
    }

    console.log(`\n🎉 Seeded ${totalAssignments} assignments successfully!`);
    console.log('\n📊 Summary:');
    console.log(`  - Courses: ${courses.length}`);
    console.log(`  - Assignments created: ${totalAssignments}`);
  } catch (error: any) {
    console.error('❌ Error seeding assignments:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

seedAssignments().catch(console.error);

