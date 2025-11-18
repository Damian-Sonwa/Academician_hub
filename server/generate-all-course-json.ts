/**
 * Generate complete JSON files for ALL courses at ALL levels
 * Uses lessonGenerator.ts to get all lesson topics and converts them to structured JSON
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic import of lesson generator
async function getLessonGenerator() {
  const module = await import('./utils/lessonGenerator.js');
  return module.generateLessonsForCourse;
}

// Course mapping based on seed.ts
const allCourses = [
  // Science
  { name: 'biology', category: 'science', title: 'Introduction to Biology', level: 'Junior' },
  { name: 'biology', category: 'science', title: 'Cell Biology and Genetics', level: 'Secondary' },
  { name: 'biology', category: 'science', title: 'Advanced Molecular Biology', level: 'Advanced' },
  { name: 'chemistry', category: 'science', title: 'Chemistry Fundamentals', level: 'Junior' },
  { name: 'chemistry', category: 'science', title: 'Organic Chemistry', level: 'Secondary' },
  { name: 'chemistry', category: 'science', title: 'Advanced Biochemistry', level: 'Advanced' },
  { name: 'physics', category: 'science', title: 'Physics: Mechanics and Motion', level: 'Junior' },
  { name: 'physics', category: 'science', title: 'Electricity and Magnetism', level: 'Secondary' },
  { name: 'physics', category: 'science', title: 'Quantum Physics', level: 'Advanced' },
  
  // Math
  { name: 'mathematics', category: 'math', title: 'Algebra Essentials', level: 'Junior' },
  { name: 'mathematics', category: 'math', title: 'Geometry and Trigonometry', level: 'Secondary' },
  { name: 'mathematics', category: 'math', title: 'Calculus I: Limits and Derivatives', level: 'Advanced' },
  { name: 'mathematics', category: 'math', title: 'Statistics for Data Science', level: 'Advanced' },
  
  // Languages
  { name: 'spanish', category: 'languages', title: 'Spanish for Beginners', level: 'Junior' },
  { name: 'spanish', category: 'languages', title: 'Intermediate Spanish Conversation', level: 'Secondary' },
  { name: 'french', category: 'languages', title: 'French Fundamentals', level: 'Junior' },
  { name: 'french', category: 'languages', title: 'Advanced French Literature', level: 'Advanced' },
  { name: 'german', category: 'languages', title: 'German Language Basics', level: 'Junior' },
  { name: 'german', category: 'languages', title: 'Business German', level: 'Secondary' },
  { name: 'chinese', category: 'languages', title: 'Mandarin Chinese for Beginners', level: 'Junior' },
  { name: 'japanese', category: 'languages', title: 'Japanese Language & Culture', level: 'Junior' },
  { name: 'arabic', category: 'languages', title: 'Arabic for Travelers', level: 'Junior' },
  { name: 'italian', category: 'languages', title: 'Italian Conversation Practice', level: 'Secondary' },
  
  // Programming
  { name: 'python', category: 'python', title: 'Python Programming Basics', level: 'Junior' },
  { name: 'python', category: 'python', title: 'Advanced Python: Data Science', level: 'Advanced' },
  { name: 'webdevelopment', category: 'webdev', title: 'Web Development Fundamentals', level: 'Junior' },
  { name: 'webdevelopment', category: 'webdev', title: 'Full-Stack JavaScript Development', level: 'Advanced' },
  
  // Cybersecurity
  { name: 'cybersecurity', category: 'cybersecurity', title: 'Introduction to Cybersecurity', level: 'Junior' },
  { name: 'cybersecurity', category: 'cybersecurity', title: 'Network Security', level: 'Secondary' },
  { name: 'cybersecurity', category: 'cybersecurity', title: 'Web Application Security', level: 'Secondary' },
  { name: 'cybersecurity', category: 'cybersecurity', title: 'Ethical Hacking Basics', level: 'Secondary' },
  { name: 'cybersecurity', category: 'cybersecurity', title: 'Digital Forensics', level: 'Advanced' },
  { name: 'cybersecurity', category: 'cybersecurity', title: 'Advanced Penetration Testing', level: 'Advanced' },
  { name: 'cybersecurity', category: 'cybersecurity', title: 'Cloud Security', level: 'Advanced' },
  
  // Humanities
  { name: 'english', category: 'english', title: 'Creative Writing Workshop', level: 'Junior' },
  { name: 'english', category: 'english', title: 'English Literature: Shakespeare', level: 'Secondary' },
  { name: 'history', category: 'history', title: 'World History: Ancient Civilizations', level: 'Junior' },
  { name: 'history', category: 'history', title: 'Modern World History', level: 'Secondary' },
  { name: 'geography', category: 'geography', title: 'Physical Geography', level: 'Junior' },
  { name: 'geography', category: 'geography', title: 'Human Geography and Culture', level: 'Secondary' },
];

// Map database levels to JSON level names
const levelToJson: Record<string, string> = {
  'Junior': 'beginner',
  'Secondary': 'intermediate',
  'Advanced': 'advanced',
};

// Helper to generate materials from lesson resources
function generateMaterials(lesson: any, category: string, level: string): any {
  const materials: any = {
    videos: [],
    textbooks: [],
    labs: [],
  };

  // Extract video URL if present
  if (lesson.videoUrl) {
    materials.videos.push({
      title: lesson.title,
      url: lesson.videoUrl,
    });
  } else {
    // Generate default video based on topic
    materials.videos.push({
      title: `${lesson.title} - Tutorial`,
      url: `https://youtu.be/dQw4w9WgXcQ`, // Placeholder
    });
  }

  // Process resources array to extract textbooks and labs
  if (lesson.resources && Array.isArray(lesson.resources)) {
    lesson.resources.forEach((resource: string) => {
      const lower = resource.toLowerCase();
      if (lower.includes('textbook') || lower.includes('book') || lower.includes('pdf') || lower.includes('guide') || lower.includes('reading')) {
        materials.textbooks.push({
          title: resource.replace(/^(Textbook|Book|PDF|Guide|Reading):\s*/i, ''),
          url: extractUrl(resource) || generateTextbookUrl(category, lesson.title),
        });
      } else if (lower.includes('lab') || lower.includes('practice') || lower.includes('quiz') || lower.includes('exercise') || lower.includes('interactive')) {
        materials.labs.push({
          title: resource.replace(/^(Lab|Practice|Quiz|Exercise|Interactive):\s*/i, ''),
          url: extractUrl(resource) || generateLabUrl(category, lesson.title),
        });
      } else if (lower.includes('video')) {
        // Extract video URL if present
        const url = extractUrl(resource);
        if (url) {
          materials.videos.push({
            title: resource.replace(/^Video:\s*/i, '').replace(/\s*-\s*https?:\/\/.*$/, ''),
            url: url,
          });
        }
      } else {
        // Default to lab/practice
        materials.labs.push({
          title: resource,
          url: generateLabUrl(category, lesson.title),
        });
      }
    });
  }

  // Add default textbooks if none found
  if (materials.textbooks.length === 0) {
    materials.textbooks.push({
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Textbook - ${level} Level`,
      url: generateTextbookUrl(category, lesson.title),
    });
  }

  // Add default lab if none found
  if (materials.labs.length === 0) {
    materials.labs.push({
      title: `${lesson.title} Practice Exercises`,
      url: generateLabUrl(category, lesson.title),
    });
  }

  return materials;
}

function extractUrl(text: string): string | null {
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  return urlMatch ? urlMatch[0] : null;
}

function generateTextbookUrl(category: string, topic: string): string {
  const categoryUrls: Record<string, string> = {
    science: 'https://openstax.org/details/books/biology-2e',
    math: 'https://openstax.org/books/algebra-and-trigonometry',
    languages: 'https://www.languageguide.org/',
    python: 'https://docs.python.org/3/tutorial/',
    webdev: 'https://developer.mozilla.org/en-US/docs/Web',
    cybersecurity: 'https://owasp.org/www-project-top-ten/',
    english: 'https://owl.purdue.edu/owl/',
    history: 'https://openstax.org/details/books/world-history-volume-1',
    geography: 'https://www.nationalgeographic.org/education/',
  };
  return categoryUrls[category] || 'https://www.example.com/textbook';
}

function generateLabUrl(category: string, topic: string): string {
  const categoryUrls: Record<string, string> = {
    science: 'https://phet.colorado.edu/',
    math: 'https://www.desmos.com/calculator',
    languages: 'https://www.languageguide.org/',
    python: 'https://www.practicepython.org/',
    webdev: 'https://codepen.io/',
    cybersecurity: 'https://tryhackme.com/',
    english: 'https://www.writersdigest.com/',
    history: 'https://www.khanacademy.org/humanities/world-history',
    geography: 'https://www.nationalgeographic.org/education/',
  };
  return categoryUrls[category] || 'https://www.example.com/lab';
}

// Generate summary from description and content
function generateSummary(lesson: any): string {
  let summary = lesson.description || '';
  const content = lesson.content || '';
  
  // Combine description and first part of content
  if (content && content.length > 50) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    if (sentences.length > 0) {
      summary += ` ${sentences[0]}.`;
    }
    if (sentences.length > 1 && summary.split(/[.!?]+/).length < 4) {
      summary += ` ${sentences[1]}.`;
    }
  }
  
  // Ensure 3-6 sentences
  const sentenceCount = summary.split(/[.!?]+/).filter(s => s.trim().length > 10).length;
  if (sentenceCount < 3) {
    summary += ` This lesson provides comprehensive coverage of the topic with practical examples and hands-on activities.`;
    summary += ` Students will gain a deep understanding through interactive learning materials and real-world applications.`;
  }
  if (sentenceCount < 4) {
    summary += ` The lesson includes detailed explanations, visual aids, and assessment tools to ensure mastery of the concepts.`;
  }
  
  return summary.trim();
}

async function generateAllCourseJSON() {
  console.log('🚀 Generating complete JSON files for ALL courses at ALL levels...\n');

  const baseDir = path.join(process.cwd(), 'seed', 'courses');
  
  // Ensure base directory exists
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  // Get lesson generator function
  const generateLessonsForCourse = await getLessonGenerator();

  let totalFiles = 0;
  let totalTopics = 0;
  const processedCourses: Record<string, Record<string, boolean>> = {};

  // Process each course
  for (const course of allCourses) {
    const jsonLevel = levelToJson[course.level];
    const courseDir = path.join(baseDir, course.name);
    
    // Create course directory
    if (!fs.existsSync(courseDir)) {
      fs.mkdirSync(courseDir, { recursive: true });
    }

    // Track processed courses to avoid duplicates
    if (!processedCourses[course.name]) {
      processedCourses[course.name] = {};
    }
    if (processedCourses[course.name][jsonLevel]) {
      continue; // Skip if already processed
    }
    processedCourses[course.name][jsonLevel] = true;

    console.log(`📖 ${course.title} (${course.name}/${jsonLevel})`);

    // Generate lessons using lessonGenerator
    const generatedLessons = generateLessonsForCourse(
      course.category,
      course.level,
      course.title
    );
    
    if (generatedLessons.length === 0) {
      console.log(`      ⚠️  No lessons generated`);
      continue;
    }

    // Convert to JSON format
    const jsonLessons = generatedLessons.map((lesson) => {
      const materials = generateMaterials(lesson, course.category, course.level);
      const summary = generateSummary(lesson);

      return {
        title: lesson.title,
        summary: summary,
        materials: materials,
      };
    });

    // Write JSON file
    const jsonFile = path.join(courseDir, `${jsonLevel}.json`);
    fs.writeFileSync(jsonFile, JSON.stringify(jsonLessons, null, 2), 'utf-8');
    
    console.log(`      ✅ Generated ${jsonLessons.length} topics → ${jsonLevel}.json`);
    totalFiles++;
    totalTopics += jsonLessons.length;
  }

  console.log('\n🎉 Generation complete!');
  console.log(`📊 Summary:`);
  console.log(`   - JSON files created/updated: ${totalFiles}`);
  console.log(`   - Total topics: ${totalTopics}`);
  console.log(`   - Location: ${baseDir}`);
}

// Run the generator
generateAllCourseJSON().catch(console.error);
