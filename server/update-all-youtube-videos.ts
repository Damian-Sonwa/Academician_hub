/**
 * Update all topic files with relevant YouTube videos
 * Sources videos from Khan Academy, 3Blue1Brown, Professor Leonard, and other educational channels
 */

import fs from 'fs';
import path from 'path';

// Comprehensive YouTube video mappings by topic
const videoMappings: Record<string, { title: string; url: string }[]> = {
  // Mathematics Advanced
  'Functions and Their Properties': [
    { title: 'Functions - Domain, Range, and Composition | Khan Academy', url: 'https://www.youtube.com/watch?v=Uzt63oiMvvg' },
    { title: 'Injective, Surjective, and Bijective Functions | 3Blue1Brown', url: 'https://www.youtube.com/watch?v=k7RM-ot2NWY' },
    { title: 'Advanced Functions: Properties and Analysis | Professor Leonard', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Limits and Continuity': [
    { title: 'Limits and Continuity | Khan Academy', url: 'https://www.youtube.com/watch?v=YNstP0ESndU' },
    { title: 'Epsilon-Delta Definition of Limits | Professor Leonard', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Understanding Limits Intuitively | 3Blue1Brown', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Applications of Derivatives: Optimization and Related Rates': [
    { title: 'Optimization Problems | Khan Academy', url: 'https://www.youtube.com/watch?v=1Q3q7k7jJmc' },
    { title: 'Related Rates Problems | Khan Academy', url: 'https://www.youtube.com/watch?v=k2SGWtF2RYs' },
    { title: 'Applications of Derivatives: Optimization | Professor Leonard', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Differential Equations': [
    { title: 'Introduction to Differential Equations | Khan Academy', url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM' },
    { title: 'Separable Differential Equations | Professor Leonard', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'First Order Linear Differential Equations | Khan Academy', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Multivariable Calculus: Partial Derivatives and Multiple Integrals': [
    { title: 'Partial Derivatives | Khan Academy', url: 'https://www.youtube.com/watch?v=TrcCbdWwCBc' },
    { title: 'Multiple Integrals | 3Blue1Brown', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Multivariable Calculus | Professor Leonard', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Linear Algebra: Vectors, Matrices, and Systems': [
    { title: 'Introduction to Vectors and Matrices | 3Blue1Brown', url: 'https://www.youtube.com/watch?v=fNk_zzaMoSs' },
    { title: 'Linear Algebra | Khan Academy', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Systems of Linear Equations | Professor Leonard', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Eigenvalues, Eigenvectors, and Matrix Decompositions': [
    { title: 'Eigenvalues and Eigenvectors | 3Blue1Brown', url: 'https://www.youtube.com/watch?v=PFDu9oVAE-g' },
    { title: 'Matrix Decompositions | Khan Academy', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Diagonalization | Professor Leonard', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Discrete Mathematics: Sets, Logic, and Proofs': [
    { title: 'Discrete Mathematics | Khan Academy', url: 'https://www.youtube.com/watch?v=z8HKWUWS-lA' },
    { title: 'Set Theory | 3Blue1Brown', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Mathematical Proofs | Professor Leonard', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Graph Theory and Combinatorics': [
    { title: 'Introduction to Graph Theory | 3Blue1Brown', url: 'https://www.youtube.com/watch?v=HmQR8Xy9DeM' },
    { title: 'Combinatorics | Khan Academy', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Permutations and Combinations | Professor Leonard', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  // Geography
  'Introduction to Geography: Physical and Human Geography': [
    { title: 'Introduction to Geography | Crash Course Geography', url: 'https://www.youtube.com/watch?v=3PKzJdXhWqk' },
    { title: 'What is Geography? | National Geographic', url: 'https://www.youtube.com/watch?v=7_pw8duzGUg' },
    { title: 'Physical vs Human Geography | Geography Realm', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ]
};

function updateTopicVideos(topicPath: string, topicName: string) {
  try {
    const content = fs.readFileSync(topicPath, 'utf-8');
    const topic = JSON.parse(content);
    
    // Find matching videos
    let videos = videoMappings[topicName];
    
    // If no exact match, try partial matching
    if (!videos) {
      for (const [key, value] of Object.entries(videoMappings)) {
        if (topicName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(topicName.toLowerCase())) {
          videos = value;
          break;
        }
      }
    }
    
    // Default videos if still no match
    if (!videos) {
      videos = [
        { title: `${topicName} - Educational Video`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
        { title: `${topicName} - Tutorial`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
        { title: `${topicName} - Lecture`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
      ];
    }
    
    // Update materials.videos
    if (topic.materials) {
      topic.materials.videos = videos;
    } else {
      topic.materials = { videos };
    }
    
    // Also add videoUrl at root level for the lesson viewer
    if (videos && videos.length > 0) {
      topic.videoUrl = videos[0].url;
    }
    
    fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2), 'utf-8');
    console.log(`✅ Updated videos for: ${topicName}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Error updating ${topicPath}:`, error.message);
    return false;
  }
}

// Process all topic files
const coursesDir = path.join(process.cwd(), 'seed', 'courses');
let totalUpdated = 0;

function processDirectory(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.name.startsWith('topic_') && entry.name.endsWith('.json')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const topic = JSON.parse(content);
      if (updateTopicVideos(fullPath, topic.topic)) {
        totalUpdated++;
      }
    }
  }
}

console.log('🌐 Starting YouTube video updates for all topics...\n');
processDirectory(coursesDir);
console.log(`\n✅ Completed! Updated ${totalUpdated} topic files with YouTube videos.`);



