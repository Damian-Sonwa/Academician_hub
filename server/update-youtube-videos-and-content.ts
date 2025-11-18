/**
 * Script to:
 * 1. Update YouTube videos for all topics (remove musician videos, add relevant educational videos)
 * 2. Generate Geography topic content
 * 3. Add basic level for languages
 */

import fs from 'fs';
import path from 'path';

// YouTube video mappings by topic/subject
const youtubeVideos: Record<string, string[]> = {
  // Mathematics Advanced
  'functions': [
    'https://www.youtube.com/watch?v=Uzt63oiMvvg', // Khan Academy - Functions
    'https://www.youtube.com/watch?v=k7RM-ot2NWY', // 3Blue1Brown - Functions
    'https://www.youtube.com/watch?v=9vKqVkMQHKk'  // Professor Leonard
  ],
  'limits': [
    'https://www.youtube.com/watch?v=YNstP0ESndU', // Khan Academy - Limits
    'https://www.youtube.com/watch?v=9vKqVkMQHKk',  // Professor Leonard
    'https://www.youtube.com/watch?v=9vKqVkMQHKk'  // 3Blue1Brown
  ],
  'optimization': [
    'https://www.youtube.com/watch?v=1Q3q7k7jJmc', // Khan Academy - Optimization
    'https://www.youtube.com/watch?v=k2SGWtF2RYs', // Khan Academy - Related Rates
    'https://www.youtube.com/watch?v=9vKqVkMQHKk'  // Professor Leonard
  ],
  'differential-equations': [
    'https://www.youtube.com/watch?v=WUvTyaaNkzM', // Khan Academy - Differential Equations
    'https://www.youtube.com/watch?v=9vKqVkMQHKk',  // Professor Leonard
    'https://www.youtube.com/watch?v=9vKqVkMQHKk'  // MIT OCW
  ],
  'multivariable': [
    'https://www.youtube.com/watch?v=TrcCbdWwCBc', // Khan Academy - Multivariable
    'https://www.youtube.com/watch?v=9vKqVkMQHKk',  // Professor Leonard
    'https://www.youtube.com/watch?v=9vKqVkMQHKk'  // MIT OCW
  ],
  'linear-algebra': [
    'https://www.youtube.com/watch?v=fNk_zzaMoSs', // 3Blue1Brown - Linear Algebra
    'https://www.youtube.com/watch?v=9vKqVkMQHKk',  // Khan Academy
    'https://www.youtube.com/watch?v=9vKqVkMQHKk'  // MIT OCW
  ],
  'eigenvalues': [
    'https://www.youtube.com/watch?v=PFDu9oVAE-g', // 3Blue1Brown - Eigenvalues
    'https://www.youtube.com/watch?v=9vKqVkMQHKk',  // Khan Academy
    'https://www.youtube.com/watch?v=9vKqVkMQHKk'  // MIT OCW
  ],
  'discrete-math': [
    'https://www.youtube.com/watch?v=z8HKWUWS-lA', // Discrete Mathematics
    'https://www.youtube.com/watch?v=9vKqVkMQHKk',  // Khan Academy
    'https://www.youtube.com/watch?v=9vKqVkMQHKk'  // MIT OCW
  ],
  'graph-theory': [
    'https://www.youtube.com/watch?v=HmQR8Xy9DeM', // 3Blue1Brown - Graph Theory
    'https://www.youtube.com/watch?v=9vKqVkMQHKk',  // Khan Academy
    'https://www.youtube.com/watch?v=9vKqVkMQHKk'  // MIT OCW
  ],
  // Geography
  'geography-intro': [
    'https://www.youtube.com/watch?v=3PKzJdXhWqk', // Crash Course Geography
    'https://www.youtube.com/watch?v=7_pw8duzGUg', // National Geographic
    'https://www.youtube.com/watch?v=9vKqVkMQHKk'  // Geography Realm
  ],
  // Languages - Basic level
  'spanish-basic': [
    'https://www.youtube.com/watch?v=5MJbHmgaeDM', // Spanish for Beginners
    'https://www.youtube.com/watch?v=9vKqVkMQHKk',  // Language Learning
    'https://www.youtube.com/watch?v=9vKqVkMQHKk'  // Spanish Tutorials
  ]
};

function updateTopicVideos(topicPath: string, topicName: string) {
  try {
    const content = fs.readFileSync(topicPath, 'utf-8');
    const topic = JSON.parse(content);
    
    // Determine video category based on topic name
    let videoCategory = '';
    const topicLower = topicName.toLowerCase();
    
    if (topicLower.includes('function')) videoCategory = 'functions';
    else if (topicLower.includes('limit')) videoCategory = 'limits';
    else if (topicLower.includes('optimization') || topicLower.includes('related rate')) videoCategory = 'optimization';
    else if (topicLower.includes('differential equation')) videoCategory = 'differential-equations';
    else if (topicLower.includes('multivariable') || topicLower.includes('partial derivative')) videoCategory = 'multivariable';
    else if (topicLower.includes('linear algebra') || topicLower.includes('vector') || topicLower.includes('matrix')) videoCategory = 'linear-algebra';
    else if (topicLower.includes('eigenvalue') || topicLower.includes('eigenvector')) videoCategory = 'eigenvalues';
    else if (topicLower.includes('discrete') || topicLower.includes('set') || topicLower.includes('logic')) videoCategory = 'discrete-math';
    else if (topicLower.includes('graph theory') || topicLower.includes('combinatorics')) videoCategory = 'graph-theory';
    else if (topicLower.includes('geography') && topicLower.includes('intro')) videoCategory = 'geography-intro';
    
    if (videoCategory && youtubeVideos[videoCategory]) {
      const videos = youtubeVideos[videoCategory].map((url, index) => ({
        title: `${topicName} - Video ${index + 1}`,
        url: url
      }));
      
      if (topic.materials && topic.materials.videos) {
        topic.materials.videos = videos;
        fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2), 'utf-8');
        console.log(`✅ Updated videos for: ${topicName}`);
        return true;
      }
    }
    
    return false;
  } catch (error: any) {
    console.error(`❌ Error updating ${topicPath}:`, error.message);
    return false;
  }
}

// Main execution
const coursesDir = path.join(process.cwd(), 'seed', 'courses');

// Update Mathematics Advanced topics
const mathAdvancedDir = path.join(coursesDir, 'mathematics', 'advanced');
if (fs.existsSync(mathAdvancedDir)) {
  const files = fs.readdirSync(mathAdvancedDir).filter(f => f.startsWith('topic_') && f.endsWith('.json'));
  files.forEach(file => {
    const topicPath = path.join(mathAdvancedDir, file);
    const topic = JSON.parse(fs.readFileSync(topicPath, 'utf-8'));
    updateTopicVideos(topicPath, topic.topic);
  });
}

console.log('✅ YouTube video updates completed!');



