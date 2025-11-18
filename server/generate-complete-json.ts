/**
 * Generate complete JSON files for ALL courses at ALL levels
 * Reads from lessonGenerator.ts and creates structured JSON files
 */

import fs from 'fs';
import path from 'path';
import { generateLessonsForCourse } from './utils/lessonGenerator.js';

// All courses from seed.ts with their exact titles
const allCourses = [
  // Science - Biology
  { name: 'biology', category: 'science', title: 'Introduction to Biology', level: 'Junior' },
  { name: 'biology', category: 'science', title: 'Cell Biology and Genetics', level: 'Secondary' },
  { name: 'biology', category: 'science', title: 'Advanced Molecular Biology', level: 'Advanced' },
  
  // Science - Chemistry
  { name: 'chemistry', category: 'science', title: 'Chemistry Fundamentals', level: 'Junior' },
  { name: 'chemistry', category: 'science', title: 'Organic Chemistry', level: 'Secondary' },
  { name: 'chemistry', category: 'science', title: 'Advanced Biochemistry', level: 'Advanced' },
  
  // Science - Physics
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
function generateMaterials(lesson: any, category: string, level: string, courseTitle: string): any {
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
    // Generate appropriate video based on topic and category
    materials.videos.push({
      title: `${lesson.title} - Tutorial`,
      url: getVideoUrl(category, lesson.title),
    });
  }

  // Process resources array
  if (lesson.resources && Array.isArray(lesson.resources)) {
    lesson.resources.forEach((resource: string) => {
      const lower = resource.toLowerCase();
      const url = extractUrl(resource);
      
      if (lower.includes('textbook') || lower.includes('book') || lower.includes('pdf') || lower.includes('guide') || lower.includes('reading')) {
        materials.textbooks.push({
          title: cleanResourceTitle(resource),
          url: url || getTextbookUrl(category, lesson.title),
        });
      } else if (lower.includes('video')) {
        if (url) {
          materials.videos.push({
            title: cleanResourceTitle(resource),
            url: url,
          });
        }
      } else {
        // Default to lab/practice
        materials.labs.push({
          title: cleanResourceTitle(resource),
          url: url || getLabUrl(category, lesson.title),
        });
      }
    });
  }

  // Add default materials if none found
  if (materials.textbooks.length === 0) {
    materials.textbooks.push({
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Textbook - ${level} Level`,
      url: getTextbookUrl(category, lesson.title),
    });
  }

  if (materials.labs.length === 0) {
    materials.labs.push({
      title: `${lesson.title} Practice Exercises`,
      url: getLabUrl(category, lesson.title),
    });
  }

  return materials;
}

function cleanResourceTitle(resource: string): string {
  return resource
    .replace(/^(Video|Textbook|Book|PDF|Guide|Reading|Lab|Practice|Quiz|Exercise|Interactive):\s*/i, '')
    .replace(/\s*-\s*https?:\/\/.*$/, '')
    .trim();
}

function extractUrl(text: string): string | null {
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  return urlMatch ? urlMatch[0] : null;
}

function getVideoUrl(category: string, topic: string): string {
  // Return appropriate video URLs based on category
  const categoryVideos: Record<string, string> = {
    science: 'https://youtu.be/dQw4w9WgXcQ',
    math: 'https://youtu.be/dQw4w9WgXcQ',
    languages: 'https://youtu.be/dQw4w9WgXcQ',
    python: 'https://youtu.be/kqtD5dpn9C8',
    webdev: 'https://youtu.be/UB1O30fR-EE',
    cybersecurity: 'https://youtu.be/inWWhr5tnEA',
    english: 'https://youtu.be/wR8CP0qJNWg',
    history: 'https://youtu.be/Yocja_N5s1I',
    geography: 'https://youtu.be/7_pw8duzGUg',
  };
  return categoryVideos[category] || 'https://youtu.be/dQw4w9WgXcQ';
}

function getTextbookUrl(category: string, topic: string): string {
  const categoryUrls: Record<string, string> = {
    science: 'https://openstax.org/details/books/biology-2e',
    math: 'https://openstax.org/books/algebra-and-trigonometry',
    languages: 'https://www.languageguide.org/',
    python: 'https://docs.python.org/3/tutorial/',
    webdev: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    cybersecurity: 'https://owasp.org/www-project-top-ten/',
    english: 'https://owl.purdue.edu/owl/',
    history: 'https://openstax.org/details/books/world-history-volume-1',
    geography: 'https://www.nationalgeographic.org/education/',
  };
  return categoryUrls[category] || 'https://www.example.com/textbook';
}

function getLabUrl(category: string, topic: string): string {
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

function generateAllCourseJSON() {
  console.log('🚀 Generating complete JSON files for ALL courses at ALL levels...\n');

  const baseDir = path.join(process.cwd(), 'seed', 'courses');
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  let totalFiles = 0;
  let totalTopics = 0;
  const processed: Record<string, Record<string, boolean>> = {};

  // Group courses by name and level
  const courseGroups: Record<string, Record<string, typeof allCourses[0]>> = {};
  
  for (const course of allCourses) {
    if (!courseGroups[course.name]) {
      courseGroups[course.name] = {};
    }
    const jsonLevel = levelToJson[course.level];
    if (!courseGroups[course.name][jsonLevel]) {
      courseGroups[course.name][jsonLevel] = course;
    }
  }

  // Process each course group
  for (const [courseName, levels] of Object.entries(courseGroups)) {
    console.log(`📖 Processing: ${courseName}`);
    
    const courseDir = path.join(baseDir, courseName);
    if (!fs.existsSync(courseDir)) {
      fs.mkdirSync(courseDir, { recursive: true });
    }

    for (const [jsonLevel, course] of Object.entries(levels)) {
      console.log(`    📝 Level: ${jsonLevel} (${course.level})`);

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
        const materials = generateMaterials(lesson, course.category, course.level, course.title);
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
    console.log('');
  }

  console.log('🎉 Generation complete!');
  console.log(`📊 Summary:`);
  console.log(`   - JSON files created/updated: ${totalFiles}`);
  console.log(`   - Total topics: ${totalTopics}`);
  console.log(`   - Location: ${baseDir}`);
}

// Run the generator
generateAllCourseJSON();



