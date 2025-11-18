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

// Map course names to categories and levels
const courseMapping: Record<string, { category: string; level: string }> = {
  biology: { category: 'science', level: 'Junior' },
  chemistry: { category: 'science', level: 'Junior' },
  physics: { category: 'science', level: 'Junior' },
  mathematics: { category: 'math', level: 'Junior' },
  spanish: { category: 'languages', level: 'Junior' },
  french: { category: 'languages', level: 'Junior' },
  german: { category: 'languages', level: 'Junior' },
  chinese: { category: 'languages', level: 'Junior' },
  japanese: { category: 'languages', level: 'Junior' },
  arabic: { category: 'languages', level: 'Junior' },
  italian: { category: 'languages', level: 'Secondary' },
  english: { category: 'english', level: 'Junior' },
  cybersecurity: { category: 'cybersecurity', level: 'Junior' },
  webdevelopment: { category: 'webdev', level: 'Junior' },
  python: { category: 'python', level: 'Junior' },
  history: { category: 'history', level: 'Junior' },
  geography: { category: 'geography', level: 'Junior' },
};

// Map level names
const levelMapping: Record<string, string> = {
  beginner: 'Junior',
  intermediate: 'Secondary',
  advanced: 'Advanced',
};

// Helper to format materials into resources array
function formatMaterials(materials: any): string[] {
  const resources: string[] = [];
  
  if (materials.videos && Array.isArray(materials.videos)) {
    materials.videos.forEach((video: any) => {
      resources.push(`Video: ${video.title} - ${video.url}`);
    });
  }
  
  if (materials.textbooks && Array.isArray(materials.textbooks)) {
    materials.textbooks.forEach((textbook: any) => {
      resources.push(`Textbook: ${textbook.title} - ${textbook.url}`);
    });
  }
  
  if (materials.labs && Array.isArray(materials.labs)) {
    materials.labs.forEach((lab: any) => {
      resources.push(`Lab: ${lab.title} - ${lab.url}`);
    });
  }
  
  return resources;
}

// Get first video URL for videoUrl field
function getFirstVideoUrl(materials: any): string | undefined {
  if (materials.videos && Array.isArray(materials.videos) && materials.videos.length > 0) {
    return materials.videos[0].url;
  }
  return undefined;
}

async function seedFromJSON() {
  try {
    console.log('🌱 Starting seed from JSON files...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const coursesDir = path.join(process.cwd(), 'seed', 'courses');
    
    if (!fs.existsSync(coursesDir)) {
      console.error('❌ Courses directory not found:', coursesDir);
      process.exit(1);
    }

    // Get all course directories
    const courseDirs = fs.readdirSync(coursesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`📚 Found ${courseDirs.length} course directories`);

    let totalCoursesCreated = 0;
    let totalLessonsCreated = 0;

    for (const courseDir of courseDirs) {
      const coursePath = path.join(coursesDir, courseDir);
      const mapping = courseMapping[courseDir.toLowerCase()];
      
      if (!mapping) {
        console.log(`⚠️  Skipping ${courseDir} - no mapping found`);
        continue;
      }

      // Process each level file
      const levels = ['beginner', 'intermediate', 'advanced'];
      
      for (const level of levels) {
        const levelFile = path.join(coursePath, `${level}.json`);
        
        if (!fs.existsSync(levelFile)) {
          continue; // Skip if file doesn't exist
        }

        const levelData = JSON.parse(fs.readFileSync(levelFile, 'utf-8'));
        const dbLevel = levelMapping[level] || level;

        // Create or find course
        const courseTitle = `${courseDir.charAt(0).toUpperCase() + courseDir.slice(1)} - ${dbLevel}`;
        let course = await Course.findOne({
          title: new RegExp(courseTitle, 'i'),
          category: mapping.category,
          level: dbLevel,
        });

        if (!course) {
          // Create new course
          course = await Course.create({
            title: courseTitle,
            description: `Comprehensive ${courseDir} course at ${dbLevel} level with structured lessons, videos, textbooks, and labs.`,
            category: mapping.category,
            level: dbLevel,
            instructor: 'Expert Instructor',
            duration: `${levelData.length * 2} weeks`,
            enrolled: 0,
            isPremium: dbLevel === 'Advanced' || dbLevel === 'Secondary',
            imageUrl: `https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80`,
          });
          totalCoursesCreated++;
          console.log(`  ✅ Created course: ${course.title}`);
        } else {
          console.log(`  ℹ️  Found existing course: ${course.title}`);
        }

        // Delete existing lessons for this course
        await Lesson.deleteMany({ courseId: course._id.toString() });
        console.log(`  🗑️  Cleared existing lessons for ${course.title}`);

        // Create lessons from JSON data
        const lessons = levelData.map((topic: any, index: number) => {
          const resources = formatMaterials(topic.materials || {});
          const videoUrl = getFirstVideoUrl(topic.materials || {});

          return {
            courseId: course._id.toString(),
            title: topic.title,
            description: topic.summary || topic.description || '',
            content: topic.summary || topic.description || '', // Use summary as content
            videoUrl: videoUrl,
            duration: 45, // Default duration
            order: index + 1,
            resources: resources,
            imageUrl: `https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80`,
            images: [],
          };
        });

        await Lesson.insertMany(lessons);
        totalLessonsCreated += lessons.length;
        console.log(`  ✅ Created ${lessons.length} lessons for ${course.title}`);
      }
    }

    console.log('\n🎉 Seed from JSON completed successfully!');
    console.log(`
📊 Summary:
  - Courses created/updated: ${totalCoursesCreated}
  - Total lessons created: ${totalLessonsCreated}
    `);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedFromJSON();

