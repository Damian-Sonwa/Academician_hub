/**
 * Enhance ALL course topic JSON files with detailed summaries, assignments, and quizzes
 * Processes all courses at all levels automatically
 */

import fs from 'fs';
import path from 'path';
import { enhanceCourseFile } from './enhance-course-topics.js';

// Map course directories to their categories
const courseCategories: Record<string, string> = {
  biology: 'science',
  chemistry: 'science',
  physics: 'science',
  mathematics: 'math',
  spanish: 'languages',
  french: 'languages',
  german: 'languages',
  chinese: 'languages',
  japanese: 'languages',
  arabic: 'languages',
  italian: 'languages',
  python: 'python',
  webdevelopment: 'webdev',
  cybersecurity: 'cybersecurity',
  'cybersecurity-network': 'cybersecurity',
  'cybersecurity-webapp': 'cybersecurity',
  'cybersecurity-ethical': 'cybersecurity',
  'cybersecurity-forensics': 'cybersecurity',
  'cybersecurity-pentest': 'cybersecurity',
  'cybersecurity-cloud': 'cybersecurity',
  english: 'english',
  history: 'history',
  geography: 'geography',
};

// Map level names
const levelMapping: Record<string, string> = {
  beginner: 'Junior',
  intermediate: 'Secondary',
  advanced: 'Advanced',
};

function enhanceAllCourses() {
  console.log('🚀 Starting enhancement of ALL courses at ALL levels...\n');

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

  let totalFiles = 0;
  let totalTopics = 0;
  const summary: Array<{
    course: string;
    level: string;
    topics: number;
    summaries: number;
    assignments: number;
    quizzes: number;
  }> = [];

  // Process each course directory
  for (const courseDir of courseDirs) {
    const coursePath = path.join(coursesDir, courseDir);
    const category = courseCategories[courseDir] || 'general';
    
    console.log(`📖 Processing: ${courseDir}`);

    // Process each level file
    const levels = ['beginner', 'intermediate', 'advanced'];
    
    for (const level of levels) {
      const levelFile = path.join(coursePath, `${level}.json`);
      
      if (!fs.existsSync(levelFile)) {
        continue; // Skip if file doesn't exist
      }

      const dbLevel = levelMapping[level] || level;
      console.log(`    📝 Enhancing ${level} level...`);

      try {
        const result = enhanceCourseFile(levelFile, category, dbLevel);
        
        if (result.updated > 0) {
          totalFiles++;
          totalTopics += result.updated;
          
          summary.push({
            course: courseDir,
            level: level,
            topics: result.updated,
            summaries: result.added.summaries,
            assignments: result.added.assignments,
            quizzes: result.added.quizzes,
          });

          console.log(`      ✅ Enhanced ${result.updated} topics`);
          console.log(`         - Summaries: ${result.added.summaries}`);
          console.log(`         - Assignments: ${result.added.assignments}`);
          console.log(`         - Quizzes: ${result.added.quizzes}`);
        }
      } catch (error: any) {
        console.error(`      ❌ Error enhancing ${level}:`, error.message);
      }
    }
    console.log('');
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Enhancement Complete!');
  console.log('='.repeat(60));
  console.log(`\n📊 Overall Summary:`);
  console.log(`   - Files enhanced: ${totalFiles}`);
  console.log(`   - Total topics: ${totalTopics}`);
  console.log(`   - Courses processed: ${courseDirs.length}`);

  console.log(`\n📋 Detailed Breakdown:\n`);
  console.log('Course'.padEnd(25) + 'Level'.padEnd(15) + 'Topics'.padEnd(10) + 'Summaries'.padEnd(12) + 'Assignments'.padEnd(12) + 'Quizzes');
  console.log('-'.repeat(80));
  
  for (const item of summary) {
    console.log(
      item.course.padEnd(25) +
      item.level.padEnd(15) +
      item.topics.toString().padEnd(10) +
      item.summaries.toString().padEnd(12) +
      item.assignments.toString().padEnd(12) +
      item.quizzes.toString()
    );
  }

  console.log('\n✅ All courses have been enhanced with detailed content!');
}

// Run the enhancement
enhanceAllCourses();

