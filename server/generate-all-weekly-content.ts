/**
 * Generate weekly content for ALL courses at ALL levels
 * Processes all course files automatically
 */

import fs from 'fs';
import path from 'path';
import { generateWeeklyContentForCourse } from './generate-weekly-content.js';

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

function generateAllWeeklyContent() {
  console.log('🚀 Generating weekly content for ALL courses at ALL levels...\n');

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

  let totalWeeks = 0;
  const summary: Array<{
    course: string;
    level: string;
    weeks: number;
  }> = [];

  // Process each course directory
  for (const courseDir of courseDirs) {
    const category = courseCategories[courseDir] || 'general';
    
    console.log(`📖 Processing: ${courseDir}`);

    // Process each level file
    const levels = ['beginner', 'intermediate', 'advanced'];
    
    for (const level of levels) {
      const levelFile = path.join(coursesDir, courseDir, `${level}.json`);
      
      if (!fs.existsSync(levelFile)) {
        continue; // Skip if file doesn't exist
      }

      console.log(`    📝 Processing ${level} level...`);

      try {
        const result = generateWeeklyContentForCourse(courseDir, level, category);
        
        if (result.weeks > 0) {
          totalWeeks += result.weeks;
          
          summary.push({
            course: courseDir,
            level: level,
            weeks: result.weeks,
          });

          console.log(`      ✅ Generated ${result.weeks} weeks`);
        }
      } catch (error: any) {
        console.error(`      ❌ Error processing ${level}:`, error.message);
      }
    }
    console.log('');
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Weekly Content Generation Complete!');
  console.log('='.repeat(60));
  console.log(`\n📊 Overall Summary:`);
  console.log(`   - Total weeks generated: ${totalWeeks}`);
  console.log(`   - Courses processed: ${courseDirs.length}`);

  console.log(`\n📋 Detailed Breakdown:\n`);
  console.log('Course'.padEnd(25) + 'Level'.padEnd(15) + 'Weeks');
  console.log('-'.repeat(50));
  
  for (const item of summary) {
    console.log(
      item.course.padEnd(25) +
      item.level.padEnd(15) +
      item.weeks.toString()
    );
  }

  console.log('\n✅ All courses now have weekly content structure!');
}

// Run the generation
generateAllWeeklyContent();



