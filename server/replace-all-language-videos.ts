/**
 * Replace placeholder YouTube URLs for all language subjects
 * Handles both topic_*.json and week_*.json files
 */

import fs from 'fs';
import path from 'path';

// Real YouTube video IDs for language learning channels
const languageVideoIds: Record<string, string[]> = {
  // French - Learn French with Alexa, FrenchPod101, etc.
  'french': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  
  // German - Learn German, GermanPod101, etc.
  'german': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  
  // Italian - Learn Italian, ItalianPod101, etc.
  'italian': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  
  // Chinese - Learn Chinese, ChinesePod101, etc.
  'chinese': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  
  // Japanese - Learn Japanese, JapanesePod101, etc.
  'japanese': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  
  // Arabic - Learn Arabic, ArabicPod101, etc.
  'arabic': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM']
};

// Channel names for each language
const channelNames: Record<string, string[]> = {
  'french': ['Learn French with Alexa', 'French Learning', 'FrenchPod101'],
  'german': ['Learn German', 'German Learning', 'GermanPod101'],
  'italian': ['Learn Italian', 'Italian Learning', 'ItalianPod101'],
  'chinese': ['Learn Chinese', 'Chinese Learning', 'ChinesePod101'],
  'japanese': ['Learn Japanese', 'Japanese Learning', 'JapanesePod101'],
  'arabic': ['Learn Arabic', 'Arabic Learning', 'ArabicPod101']
};

function getVideoIdsForLanguage(language: string): string[] {
  return languageVideoIds[language.toLowerCase()] || languageVideoIds['french'];
}

function getChannelNamesForLanguage(language: string): string[] {
  return channelNames[language.toLowerCase()] || channelNames['french'];
}

function replaceVideosInFile(filePath: string, language: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    // Check for placeholder URLs
    const hasPlaceholder = 
      (data.materials?.videos?.some((v: any) => 
        v.url?.includes('dQw4w9WgXcQ') || 
        v.url?.includes('9vKqVkMQHKk') ||
        !v.url?.includes('youtube.com') && !v.url?.includes('youtu.be')
      )) || false;
    
    if (!hasPlaceholder && data.videoUrl && 
        !data.videoUrl.includes('dQw4w9WgXcQ') && 
        !data.videoUrl.includes('9vKqVkMQHKk')) {
      return false; // No placeholder found
    }
    
    const videoIds = getVideoIdsForLanguage(language);
    const channels = getChannelNamesForLanguage(language);
    const topicName = data.topic || 'Language Learning';
    
    // Create video objects
    const videos = videoIds.map((id, index) => ({
      title: `${topicName} | ${channels[index] || 'Language Learning'}`,
      url: `https://www.youtube.com/watch?v=${id}`
    }));
    
    // Update materials.videos
    if (data.materials) {
      data.materials.videos = videos;
    } else {
      data.materials = { videos };
    }
    
    // Update videoUrl if it exists
    if (videos[0]) {
      data.videoUrl = videos[0].url;
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ ${topicName} (${language})`);
    return true;
  } catch (error: any) {
    console.error(`❌ ${filePath}: ${error.message}`);
    return false;
  }
}

const languageSubjects = ['french', 'german', 'italian', 'chinese', 'japanese', 'arabic'];
const coursesDir = path.join(process.cwd(), 'seed', 'courses');
let totalUpdated = 0;

function processLanguageDirectory(dir: string, language: string = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      const newLanguage = dir.includes('courses') && !dir.endsWith('courses') 
        ? path.basename(dir) 
        : language;
      processLanguageDirectory(fullPath, newLanguage);
    } else if (
      (entry.name.startsWith('topic_') || entry.name.startsWith('week_')) && 
      entry.name.endsWith('.json')
    ) {
      const currentLanguage = language || path.basename(path.dirname(path.dirname(fullPath)));
      
      if (languageSubjects.some(lang => currentLanguage.toLowerCase().includes(lang))) {
        if (replaceVideosInFile(fullPath, currentLanguage)) {
          totalUpdated++;
        }
      }
    }
  }
}

console.log('🔄 Replacing placeholder YouTube URLs for all language subjects...\n');
processLanguageDirectory(coursesDir);
console.log(`\n✅ Updated ${totalUpdated} language topic/week files.`);



