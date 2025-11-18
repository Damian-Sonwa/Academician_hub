/**
 * Fix course images to be subject-specific and ensure all language topics have quizzes/assignments
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Course from './models/Course';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evolve-hub';

// Subject-specific images from Unsplash
const SUBJECT_IMAGES: Record<string, { junior?: string; secondary?: string; advanced?: string }> = {
  Mathematics: {
    junior: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
  },
  Biology: {
    junior: 'https://images.unsplash.com/photo-1546410531-bb448c177e47?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1546410531-bb448c177e47?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1536514498804-1085e141197e?w=800&q=80',
  },
  Chemistry: {
    junior: 'https://images.unsplash.com/photo-1582719478250-c866776b110c?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1582719478250-c866776b110c?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1594729095022-e2f6d29b8d9f?w=800&q=80',
  },
  Physics: {
    junior: 'https://images.unsplash.com/photo-1594729095022-e2f6d29b8d9f?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1594729095022-e2f6d29b8d9f?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1581092917910-e7b0b2f3b0f0?w=800&q=80',
  },
  English: {
    junior: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1512820790803-83ca750da1c7?w=800&q=80',
  },
  History: {
    junior: 'https://images.unsplash.com/photo-1518655048521-a130df29d035?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1518655048521-a130df29d035?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1517487881594-2787fef5ee47?w=800&q=80',
  },
  Geography: {
    junior: 'https://images.unsplash.com/photo-1532635241-e020d435e7a2?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1532635241-e020d435e7a2?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1501785888041-af3ba6f60060?w=800&q=80',
  },
  Webdevelopment: {
    junior: 'https://images.unsplash.com/photo-1521737711867-ee1710707342?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1521737711867-ee1710707342?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1542831371-29b0f74f94dd?w=800&q=80',
  },
  Python: {
    junior: 'https://images.unsplash.com/photo-1542831371-29b0f74f94dd?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1542831371-29b0f74f94dd?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1521737711867-ee1710707342?w=800&q=80',
  },
  Cybersecurity: {
    junior: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80',
  },
  // Language-specific images
  Spanish: {
    junior: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=800&q=80', // Spanish flag/culture
    secondary: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80', // Language learning
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80', // Advanced language
  },
  French: {
    junior: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', // French flag/culture
    secondary: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80', // Language learning
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80', // Advanced language
  },
  German: {
    junior: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // German culture
    secondary: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80', // Language learning
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80', // Advanced language
  },
  Italian: {
    junior: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=80', // Italian culture
    secondary: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80', // Language learning
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80', // Advanced language
  },
  Chinese: {
    junior: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80', // Chinese culture
    secondary: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80', // Language learning
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80', // Advanced language
  },
  Japanese: {
    junior: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', // Japanese culture
    secondary: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80', // Language learning
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80', // Advanced language
  },
  Arabic: {
    junior: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80', // Arabic/Middle Eastern culture
    secondary: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80', // Language learning
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80', // Advanced language
  },
};

async function updateCourseImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const allCourses = await Course.find({}).sort({ title: 1 });
    console.log(`📚 Total courses: ${allCourses.length}\n`);

    let updatedCount = 0;

    for (const course of allCourses) {
      const subject = course.title.split(' - ')[0];
      const level = course.level.toLowerCase();
      const images = SUBJECT_IMAGES[subject];

      if (images) {
        let expectedImage = '';
        
        if (level === 'junior') {
          expectedImage = images.junior || images.secondary || images.advanced;
        } else if (level === 'secondary') {
          expectedImage = images.secondary || images.advanced || images.junior;
        } else if (level === 'advanced') {
          expectedImage = images.advanced || images.secondary || images.junior;
        }

        if (expectedImage && course.imageUrl !== expectedImage) {
          course.imageUrl = expectedImage;
          await course.save();
          console.log(`  🔄 Updated: ${course.title}`);
          updatedCount++;
        }
      } else {
        const defaultImage = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80';
        if (!course.imageUrl || course.imageUrl !== defaultImage) {
          course.imageUrl = defaultImage;
          await course.save();
          console.log(`  🔄 Updated (default): ${course.title}`);
          updatedCount++;
        }
      }
    }

    console.log(`\n✅ Updated ${updatedCount} course images\n`);
  } catch (error: any) {
    console.error('❌ Error updating images:', error.message);
  }
}

function fixLanguageTopicContent(topicPath: string, language: string) {
  try {
    const content = fs.readFileSync(topicPath, 'utf-8');
    const topic = JSON.parse(content);
    
    let needsUpdate = false;
    
    // Check for French contamination in Arabic
    if (language.toLowerCase() === 'arabic') {
      const hasFrench = JSON.stringify(topic).toLowerCase().includes('french') || 
                       JSON.stringify(topic).toLowerCase().includes('français');
      if (hasFrench) {
        console.log(`⚠️  Found French content in: ${topic.topic}`);
        // Fix would go here - but grep showed no French in Arabic files
      }
    }
    
    // Ensure assignments exist
    if (!topic.assignments || topic.assignments.length === 0) {
      topic.assignments = [{
        title: `Practice ${topic.topic}`,
        description: `Practice and demonstrate understanding of ${topic.topic} in ${language}.`,
        tasks: [
          `Create flashcards for all vocabulary related to ${topic.topic}`,
          `Practice pronunciation daily for one week`,
          `Write simple sentences using the vocabulary from ${topic.topic}`,
          `Record yourself speaking the vocabulary correctly`,
          `Create a simple dialogue or conversation using ${topic.topic} concepts`
        ]
      }];
      needsUpdate = true;
    }
    
    // Ensure quizzes exist
    if (!topic.quizzes || topic.quizzes.length === 0) {
      topic.quizzes = [
        {
          question: `What is the main focus of ${topic.topic}?`,
          type: "multiple-choice",
          options: [
            `Learning basic ${language} vocabulary and concepts`,
            "Advanced grammar structures",
            "Literary analysis",
            "Historical context"
          ],
          correctAnswer: 0,
          explanation: `${topic.topic} focuses on learning basic ${language} vocabulary and fundamental concepts.`,
        },
        {
          question: `Why is ${topic.topic} important for ${language} learners?`,
          type: "multiple-choice",
          options: [
            "It provides essential foundational knowledge",
            "It is only useful for advanced learners",
            "It has no practical application",
            "It is outdated information"
          ],
          correctAnswer: 0,
          explanation: `${topic.topic} provides essential foundational knowledge that all ${language} learners need.`,
        }
      ];
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2), 'utf-8');
      console.log(`✅ Fixed: ${topic.topic} (${language})`);
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error(`❌ Error fixing ${topicPath}: ${error.message}`);
    return false;
  }
}

function fixAllLanguageTopics() {
  const languages = ['spanish', 'french', 'german', 'italian', 'chinese', 'japanese', 'arabic'];
  const coursesDir = path.join(process.cwd(), 'seed', 'courses');
  let fixedCount = 0;

  for (const language of languages) {
    const langDir = path.join(coursesDir, language);
    if (!fs.existsSync(langDir)) continue;

    // Check all level directories
    const levels = ['basic', 'beginner', 'intermediate', 'advanced'];
    for (const level of levels) {
      const levelDir = path.join(langDir, level);
      if (!fs.existsSync(levelDir)) continue;

      const files = fs.readdirSync(levelDir)
        .filter(file => file.startsWith('topic_') && file.endsWith('.json'));

      for (const file of files) {
        const filePath = path.join(levelDir, file);
        if (fixLanguageTopicContent(filePath, language)) {
          fixedCount++;
        }
      }
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} language topic files\n`);
}

async function main() {
  console.log('🔄 Fixing course images and language content...\n');
  
  // Fix course images
  await updateCourseImages();
  
  // Fix language topics
  fixAllLanguageTopics();
  
  await mongoose.disconnect();
  console.log('👋 Disconnected from MongoDB');
}

main();



