/**
 * Load topic JSON files into MongoDB as lessons
 * Reads topic_*.json files and creates lessons in the database
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

// Map course names to categories
const courseMapping: Record<string, { category: string }> = {
  biology: { category: 'science' },
  chemistry: { category: 'science' },
  physics: { category: 'science' },
  mathematics: { category: 'math' },
  spanish: { category: 'languages' },
  french: { category: 'languages' },
  german: { category: 'languages' },
  chinese: { category: 'languages' },
  japanese: { category: 'languages' },
  arabic: { category: 'languages' },
  italian: { category: 'languages' },
  english: { category: 'english' },
  cybersecurity: { category: 'cybersecurity' },
  webdevelopment: { category: 'webdev' },
  python: { category: 'python' },
  history: { category: 'history' },
  geography: { category: 'geography' },
};

// Map level names
const levelMapping: Record<string, string> = {
  basic: 'Junior',
  beginner: 'Junior',
  intermediate: 'Secondary',
  secondary: 'Secondary',
  advanced: 'Advanced',
};

/**
 * Convert fullTopicLesson object to readable markdown format
 */
function formatFullTopicLessonToMarkdown(fullTopicLesson: any): string {
  if (!fullTopicLesson) return '';

  let markdown = '';

  // Definitions section
  if (fullTopicLesson.definitions && Object.keys(fullTopicLesson.definitions).length > 0) {
    markdown += '## 📚 Definitions\n\n';
    for (const [term, definition] of Object.entries(fullTopicLesson.definitions)) {
      markdown += `**${term}**: ${definition}\n\n`;
    }
    markdown += '\n';
  }

  // Key Concepts section
  if (fullTopicLesson.keyConcepts && fullTopicLesson.keyConcepts.length > 0) {
    markdown += '## 🎯 Key Concepts\n\n';
    fullTopicLesson.keyConcepts.forEach((concept: string) => {
      markdown += `- ${concept}\n`;
    });
    markdown += '\n';
  }

  // Step-by-Step Explanations
  if (fullTopicLesson.stepByStepExplanations && fullTopicLesson.stepByStepExplanations.length > 0) {
    markdown += '## 📖 Step-by-Step Explanations\n\n';
    fullTopicLesson.stepByStepExplanations.forEach((explanation: string, index: number) => {
      markdown += `${explanation}\n\n`;
    });
    markdown += '\n';
  }

  // Examples section
  if (fullTopicLesson.examples && fullTopicLesson.examples.length > 0) {
    markdown += '## 💡 Examples\n\n';
    fullTopicLesson.examples.forEach((example: string, index: number) => {
      markdown += `${example}\n\n`;
    });
    markdown += '\n';
  }

  // Real-Life Applications
  if (fullTopicLesson.realLifeApplications && fullTopicLesson.realLifeApplications.length > 0) {
    markdown += '## 🌍 Real-Life Applications\n\n';
    fullTopicLesson.realLifeApplications.forEach((application: string, index: number) => {
      markdown += `${application}\n\n`;
    });
    markdown += '\n';
  }

  // Diagrams/Image Descriptions
  if (fullTopicLesson.diagramsOrImageDescriptions && fullTopicLesson.diagramsOrImageDescriptions.length > 0) {
    markdown += '## 📊 Visual Aids\n\n';
    fullTopicLesson.diagramsOrImageDescriptions.forEach((diagram: string, index: number) => {
      markdown += `${diagram}\n\n`;
    });
    markdown += '\n';
  }

  // Code Samples (if any)
  if (fullTopicLesson.codeSamples && fullTopicLesson.codeSamples.length > 0) {
    markdown += '## 💻 Code Samples\n\n';
    fullTopicLesson.codeSamples.forEach((code: string, index: number) => {
      markdown += '```\n';
      markdown += `${code}\n`;
      markdown += '```\n\n';
    });
  }

  return markdown.trim();
}

async function seedTopicsToMongoDB() {
  try {
    console.log('🌱 Starting topic files seed to MongoDB...');
    
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

    console.log(`📚 Found ${courseDirs.length} course directories\n`);

    let totalLessonsCreated = 0;
    let totalLessonsUpdated = 0;

    for (const courseDir of courseDirs) {
      const coursePath = path.join(coursesDir, courseDir);
      const mapping = courseMapping[courseDir.toLowerCase()];
      
      if (!mapping) {
        console.log(`⚠️  Skipping ${courseDir} - no mapping found`);
        continue;
      }

           // Process each level directory
           const levels = ['basic', 'beginner', 'intermediate', 'secondary', 'advanced'];
      
      for (const level of levels) {
        const levelDir = path.join(coursePath, level);
        
        if (!fs.existsSync(levelDir)) {
          continue; // Skip if directory doesn't exist
        }

        // Find topic_*.json files
        const files = fs.readdirSync(levelDir)
          .filter(file => file.startsWith('topic_') && file.endsWith('.json'))
          .sort((a, b) => {
            const numA = parseInt(a.match(/topic_(\d+)/)?.[1] || '0');
            const numB = parseInt(b.match(/topic_(\d+)/)?.[1] || '0');
            return numA - numB;
          });

        if (files.length === 0) {
          continue; // No topic files found
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
          // Create new course
          course = await Course.create({
            title: courseTitle,
            description: `Comprehensive ${courseDir} course at ${dbLevel} level with detailed topics, assignments, and quizzes.`,
            category: mapping.category,
            level: dbLevel,
            instructor: 'Expert Instructor',
            duration: `${files.length * 2} weeks`,
            enrolled: 0,
            isPremium: dbLevel === 'Advanced' || dbLevel === 'Secondary',
            imageUrl: `https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80`,
          });
          console.log(`  ✅ Created course: ${course.title}`);
        }

        console.log(`\n📖 Processing ${courseTitle} (${files.length} topics)...`);

        // Process each topic file
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const filePath = path.join(levelDir, file);
          const topicData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

          // Format resources from materials
          const resources: string[] = [];
          if (topicData.materials?.videos) {
            topicData.materials.videos.forEach((video: any) => {
              resources.push(`Video: ${video.title} - ${video.url}`);
            });
          }
          if (topicData.materials?.textbooks) {
            topicData.materials.textbooks.forEach((textbook: any) => {
              resources.push(`Textbook: ${textbook.title} - ${textbook.url}`);
            });
          }
          if (topicData.materials?.labs) {
            topicData.materials.labs.forEach((lab: any) => {
              resources.push(`Lab: ${lab.title} - ${lab.url}`);
            });
          }

          // Get video URL (prefer root-level videoUrl, then first video in materials)
          const videoUrl = topicData.videoUrl || topicData.materials?.videos?.[0]?.url;

          // Get images
          const imageUrl = topicData.images?.main || topicData.materials?.videos?.[0]?.url || 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80';
          const images = topicData.images?.additional || [];

          // Format quiz questions
          const quizQuestions = topicData.quizzes?.map((q: any) => {
            if (q.type === 'true-false') {
              return {
                question: q.question,
                options: ['True', 'False'],
                correctAnswer: q.correctAnswer === true ? 0 : 1,
                explanation: q.explanation,
              };
            } else {
              return {
                question: q.question,
                options: q.options || [],
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
              };
            }
          }) || [];

          // Check if lesson already exists (by title OR by order number for same course)
          const existingLesson = await Lesson.findOne({
            courseId: course._id.toString(),
            $or: [
              { title: topicData.topic },
              { order: i + 1 } // Also check by order to update if title changed
            ],
          });

          // Format fullTopicLesson to markdown if it exists
          let formattedContent = topicData.detailedSummary || '';
          if (topicData.fullTopicLesson) {
            const markdownContent = formatFullTopicLessonToMarkdown(topicData.fullTopicLesson);
            // Combine detailed summary with formatted fullTopicLesson
            formattedContent = `${topicData.detailedSummary || ''}\n\n${markdownContent}`;
          }

          const lessonData = {
            courseId: course._id.toString(),
            title: topicData.topic,
            description: topicData.whyItMatters || topicData.detailedSummary?.substring(0, 200) || '',
            content: formattedContent,
            videoUrl: videoUrl,
            duration: 50, // Default duration
            order: i + 1,
            resources: resources,
            imageUrl: imageUrl,
            images: images,
            assignments: topicData.assignments || [],
            quiz: quizQuestions.length > 0 ? { questions: quizQuestions } : undefined,
          };

          if (existingLesson) {
            // Update existing lesson
            await Lesson.updateOne(
              { _id: existingLesson._id },
              { $set: lessonData }
            );
            totalLessonsUpdated++;
            console.log(`  ✅ Updated: ${topicData.topic}`);
          } else {
            // Create new lesson
            await Lesson.create(lessonData);
            totalLessonsCreated++;
            console.log(`  ✅ Created: ${topicData.topic}`);
          }
        }
      }
    }

    console.log('\n🎉 Topic files seeded successfully!');
    console.log(`
📊 Summary:
  - Lessons created: ${totalLessonsCreated}
  - Lessons updated: ${totalLessonsUpdated}
  - Total processed: ${totalLessonsCreated + totalLessonsUpdated}
    `);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedTopicsToMongoDB();

