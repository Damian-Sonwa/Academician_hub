/**
 * Seed database with weekly content from JSON files
 * Loads all weekly content into MongoDB
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Course from './models/Course';
import Lesson from './models/Lesson';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evolve-hub';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env!');
  process.exit(1);
}

interface WeeklyContent {
  course: string;
  level: string;
  week: number;
  topic: string;
  summary: string;
  why_it_matters: string;
  materials: {
    videos: Array<{ title: string; url: string }>;
    textbooks: Array<{ title: string; url: string }>;
    labs: Array<{ title: string; url: string }>;
  };
  assignments: Array<{
    title: string;
    description: string;
    tasks: string[];
  }>;
  quizzes: Array<{
    question: string;
    options?: string[];
    answer: string | number | boolean;
    type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
    explanation?: string;
  }>;
}

// Map course names to categories and database levels
const courseMapping: Record<string, { category: string; dbLevel: string }> = {
  biology: { category: 'science', dbLevel: 'Junior' },
  chemistry: { category: 'science', dbLevel: 'Junior' },
  physics: { category: 'science', dbLevel: 'Junior' },
  mathematics: { category: 'math', dbLevel: 'Junior' },
  spanish: { category: 'languages', dbLevel: 'Junior' },
  french: { category: 'languages', dbLevel: 'Junior' },
  german: { category: 'languages', dbLevel: 'Junior' },
  chinese: { category: 'languages', dbLevel: 'Junior' },
  japanese: { category: 'languages', dbLevel: 'Junior' },
  arabic: { category: 'languages', dbLevel: 'Junior' },
  italian: { category: 'languages', dbLevel: 'Secondary' },
  english: { category: 'english', dbLevel: 'Junior' },
  cybersecurity: { category: 'cybersecurity', dbLevel: 'Junior' },
  webdevelopment: { category: 'webdev', dbLevel: 'Junior' },
  python: { category: 'python', dbLevel: 'Junior' },
  history: { category: 'history', dbLevel: 'Junior' },
  geography: { category: 'geography', dbLevel: 'Junior' },
};

const levelMapping: Record<string, string> = {
  beginner: 'Junior',
  intermediate: 'Secondary',
  advanced: 'Advanced',
};

// Convert weekly content to lesson format
function weeklyContentToLesson(weekly: WeeklyContent, courseId: string, order: number): any {
  // Format materials into resources array
  const resources: string[] = [];
  
  weekly.materials.videos.forEach(video => {
    resources.push(`Video: ${video.title} - ${video.url}`);
  });
  
  weekly.materials.textbooks.forEach(textbook => {
    resources.push(`Textbook: ${textbook.title} - ${textbook.url}`);
  });
  
  weekly.materials.labs.forEach(lab => {
    resources.push(`Lab: ${lab.title} - ${lab.url}`);
  });
  
  // Get first video URL
  const videoUrl = weekly.materials.videos.length > 0 ? weekly.materials.videos[0].url : undefined;
  
  // Convert quizzes to lesson quiz format
  const quiz = weekly.quizzes.length > 0 ? {
    questions: weekly.quizzes.map(q => {
      if (q.type === 'multiple-choice' && q.options) {
        return {
          question: q.question,
          options: q.options,
          correctAnswer: typeof q.answer === 'number' ? q.answer : 0,
          explanation: q.explanation || '',
        };
      } else if (q.type === 'true-false') {
        return {
          question: q.question,
          options: ['True', 'False'],
          correctAnswer: q.answer === true ? 0 : 1,
          explanation: q.explanation || '',
        };
      } else {
        return {
          question: q.question,
          options: [String(q.answer)],
          correctAnswer: 0,
          explanation: q.explanation || '',
        };
      }
    }),
  } : undefined;
  
  return {
    courseId: courseId,
    title: weekly.topic,
    description: weekly.why_it_matters,
    content: weekly.summary,
    videoUrl: videoUrl,
    duration: 60, // Default 60 minutes per week
    order: order,
    resources: resources,
    imageUrl: `https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80`,
    images: [],
    quiz: quiz,
    // Store weekly metadata in a way that can be retrieved
    week: weekly.week,
    assignments: weekly.assignments,
  };
}

async function seedWeeklyContent() {
  try {
    console.log('🌱 Starting weekly content seeding...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const coursesDir = path.join(process.cwd(), 'seed', 'courses');
    
    if (!fs.existsSync(coursesDir)) {
      console.error('❌ Courses directory not found:', coursesDir);
      process.exit(1);
    }

    const courseDirs = fs.readdirSync(coursesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`📚 Found ${courseDirs.length} course directories\n`);

    let totalWeeks = 0;
    let totalLessons = 0;

    for (const courseDir of courseDirs) {
      const mapping = courseMapping[courseDir.toLowerCase()];
      
      if (!mapping) {
        console.log(`⚠️  Skipping ${courseDir} - no mapping found`);
        continue;
      }

      console.log(`📖 Processing: ${courseDir}`);

      // Process each level
      const levels = ['beginner', 'intermediate', 'advanced'];
      
      for (const level of levels) {
        const levelDir = path.join(coursesDir, courseDir, level);
        
        if (!fs.existsSync(levelDir)) {
          continue;
        }

        const dbLevel = levelMapping[level] || level;
        const courseTitle = `${courseDir.charAt(0).toUpperCase() + courseDir.slice(1)} - ${dbLevel}`;
        
        // Find or create course
        let course = await Course.findOne({
          title: new RegExp(courseTitle, 'i'),
          category: mapping.category,
          level: dbLevel,
        });

        if (!course) {
          course = await Course.create({
            title: courseTitle,
            description: `Comprehensive ${courseDir} course at ${dbLevel} level with weekly structured content.`,
            category: mapping.category,
            level: dbLevel,
            instructor: 'Expert Instructor',
            duration: '8 weeks',
            enrolled: 0,
            isPremium: dbLevel === 'Advanced' || dbLevel === 'Secondary',
            imageUrl: `https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80`,
          });
          console.log(`  ✅ Created course: ${course.title}`);
        }

        // Delete existing lessons for this course
        await Lesson.deleteMany({ courseId: course._id.toString() });
        console.log(`  🗑️  Cleared existing lessons for ${course.title}`);

        // Get all week files
        const weekFiles = fs.readdirSync(levelDir)
          .filter(file => file.startsWith('week_') && file.endsWith('.json'))
          .sort((a, b) => {
            const weekA = parseInt(a.match(/week_(\d+)/)?.[1] || '0');
            const weekB = parseInt(b.match(/week_(\d+)/)?.[1] || '0');
            return weekA - weekB;
          });

        console.log(`    📝 Found ${weekFiles.length} weeks`);

        const lessons = [];

        for (const weekFile of weekFiles) {
          const weekPath = path.join(levelDir, weekFile);
          const weeklyContent: WeeklyContent = JSON.parse(fs.readFileSync(weekPath, 'utf-8'));
          
          const lesson = weeklyContentToLesson(
            weeklyContent,
            course._id.toString(),
            weeklyContent.week
          );
          
          lessons.push(lesson);
          totalWeeks++;
        }

        if (lessons.length > 0) {
          await Lesson.insertMany(lessons);
          totalLessons += lessons.length;
          console.log(`    ✅ Created ${lessons.length} lessons (weeks) for ${course.title}`);
        }
      }
      console.log('');
    }

    console.log('\n🎉 Weekly content seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Total weeks processed: ${totalWeeks}`);
    console.log(`   - Total lessons created: ${totalLessons}`);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedWeeklyContent();



