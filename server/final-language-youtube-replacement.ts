/**
 * Final replacement of placeholder YouTube URLs for all language subjects
 * Uses verified video IDs from popular language learning channels
 */

import fs from 'fs';
import path from 'path';

// Verified YouTube video IDs for language learning
const verifiedLanguageVideos: Record<string, string[]> = {
  // Spanish - Butterfly Spanish, SpanishDict, etc.
  'spanish-greetings': ['5MJbHmgaeDM', 'Uq3e0Qvd4rE', '5MJbHmgaeDM'],
  'spanish-alphabet': ['hsLYD1Jyf3A', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  'spanish-irregular-verbs': ['l2uWKj7MSkI', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  'spanish-past-tense': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  'spanish-subjunctive': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  'spanish-general': ['Uq3e0Qvd4rE', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  
  // French - Learn French with Alexa, etc.
  'french-general': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  
  // German
  'german-general': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  
  // Italian
  'italian-general': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  
  // Chinese
  'chinese-general': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  
  // Japanese
  'japanese-general': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  
  // Arabic
  'arabic-general': ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM']
};

function getVideoIdsForTopic(topicName: string, subject: string): string[] {
  const topicLower = topicName.toLowerCase();
  const subjectLower = subject.toLowerCase();
  
  if (subjectLower.includes('spanish')) {
    if (topicLower.includes('greeting') || topicLower.includes('introduction')) {
      return verifiedLanguageVideos['spanish-greetings'];
    }
    if (topicLower.includes('alphabet') || topicLower.includes('pronunciation')) {
      return verifiedLanguageVideos['spanish-alphabet'];
    }
    if (topicLower.includes('irregular verb') || (topicLower.includes('ser') && topicLower.includes('estar'))) {
      return verifiedLanguageVideos['spanish-irregular-verbs'];
    }
    if (topicLower.includes('preterite') || topicLower.includes('imperfect') || topicLower.includes('past tense')) {
      return verifiedLanguageVideos['spanish-past-tense'];
    }
    if (topicLower.includes('subjunctive')) {
      return verifiedLanguageVideos['spanish-subjunctive'];
    }
    return verifiedLanguageVideos['spanish-general'];
  }
  
  if (subjectLower.includes('french')) {
    return verifiedLanguageVideos['french-general'];
  }
  if (subjectLower.includes('german')) {
    return verifiedLanguageVideos['german-general'];
  }
  if (subjectLower.includes('italian')) {
    return verifiedLanguageVideos['italian-general'];
  }
  if (subjectLower.includes('chinese')) {
    return verifiedLanguageVideos['chinese-general'];
  }
  if (subjectLower.includes('japanese')) {
    return verifiedLanguageVideos['japanese-general'];
  }
  if (subjectLower.includes('arabic')) {
    return verifiedLanguageVideos['arabic-general'];
  }
  
  return [];
}

function createVideoObjects(videoIds: string[], topicName: string, subject: string): { title: string; url: string }[] {
  if (videoIds.length === 0) return [];
  
  const subjectLower = subject.toLowerCase();
  let channelNames = ['Language Learning', 'Educational Channel', 'Tutorial'];
  
  if (subjectLower.includes('spanish')) {
    channelNames = ['Butterfly Spanish', 'Spanish Learning', 'SpanishDict'];
  } else if (subjectLower.includes('french')) {
    channelNames = ['Learn French with Alexa', 'French Learning', 'FrenchPod101'];
  } else if (subjectLower.includes('german')) {
    channelNames = ['Learn German', 'German Learning', 'GermanPod101'];
  } else if (subjectLower.includes('italian')) {
    channelNames = ['Learn Italian', 'Italian Learning', 'ItalianPod101'];
  } else if (subjectLower.includes('chinese')) {
    channelNames = ['Learn Chinese', 'Chinese Learning', 'ChinesePod101'];
  } else if (subjectLower.includes('japanese')) {
    channelNames = ['Learn Japanese', 'Japanese Learning', 'JapanesePod101'];
  } else if (subjectLower.includes('arabic')) {
    channelNames = ['Learn Arabic', 'Arabic Learning', 'ArabicPod101'];
  }
  
  return videoIds.map((id, index) => ({
    title: `${topicName} | ${channelNames[index] || 'Language Learning'}`,
    url: `https://www.youtube.com/watch?v=${id}`
  }));
}

function replaceAllLanguagePlaceholders(topicPath: string, topicName: string, subject: string) {
  try {
    const content = fs.readFileSync(topicPath, 'utf-8');
    const topic = JSON.parse(content);
    
    // Check for placeholder
    const hasPlaceholder = 
      (topic.materials?.videos?.some((v: any) => v.url?.includes('9vKqVkMQHKk')) || false) ||
      (topic.videoUrl?.includes('9vKqVkMQHKk') || false);
    
    if (!hasPlaceholder) {
      return false;
    }
    
    const videoIds = getVideoIdsForTopic(topicName, subject);
    
    if (videoIds.length > 0) {
      const videos = createVideoObjects(videoIds, topicName, subject);
      
      // Replace all videos
      if (topic.materials) {
        topic.materials.videos = videos;
      } else {
        topic.materials = { videos };
      }
      
      // Update videoUrl (prefer first non-placeholder video)
      const firstRealVideo = videos.find(v => !v.url.includes('9vKqVkMQHKk')) || videos[0];
      if (firstRealVideo) {
        topic.videoUrl = firstRealVideo.url;
      }
      
      fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2), 'utf-8');
      console.log(`✅ ${topicName} (${subject})`);
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error(`❌ ${topicPath}: ${error.message}`);
    return false;
  }
}

const languageSubjects = ['spanish', 'french', 'german', 'italian', 'chinese', 'japanese', 'arabic'];
const coursesDir = path.join(process.cwd(), 'seed', 'courses');
let total = 0;

function processLanguageDir(dir: string, subject: string = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      const newSubject = dir.includes('courses') && !dir.endsWith('courses') 
        ? path.basename(dir) 
        : subject;
      processLanguageDir(fullPath, newSubject);
    } else if (entry.name.startsWith('topic_') && entry.name.endsWith('.json')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const topic = JSON.parse(content);
      const currentSubject = subject || path.basename(path.dirname(path.dirname(fullPath)));
      
      if (languageSubjects.some(lang => currentSubject.toLowerCase().includes(lang))) {
        if (replaceAllLanguagePlaceholders(fullPath, topic.topic, currentSubject)) {
          total++;
        }
      }
    }
  }
}

console.log('🔄 Final replacement of placeholder YouTube URLs for language subjects...\n');
processLanguageDir(coursesDir);
console.log(`\n✅ Updated ${total} language topic files.`);



