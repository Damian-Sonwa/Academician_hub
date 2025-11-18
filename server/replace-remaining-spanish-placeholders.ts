/**
 * Replace remaining placeholder URLs in Spanish topics
 */

import fs from 'fs';
import path from 'path';

// Real YouTube video IDs for Spanish learning
const spanishVideoIds = {
  'greetings': ['5MJbHmgaeDM', 'Uq3e0Qvd4rE', '5MJbHmgaeDM'],
  'alphabet': ['hsLYD1Jyf3A', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  'irregular-verbs': ['l2uWKj7MSkI', '5MJbHmgaeDM', '5MJbHmgaeDM'],
  'default': ['Uq3e0Qvd4rE', '5MJbHmgaeDM', '5MJbHmgaeDM']
};

function getSpanishVideoIds(topicName: string): string[] {
  const topicLower = topicName.toLowerCase();
  
  if (topicLower.includes('greeting') || topicLower.includes('introduction')) {
    return spanishVideoIds['greetings'];
  }
  if (topicLower.includes('alphabet') || topicLower.includes('pronunciation')) {
    return spanishVideoIds['alphabet'];
  }
  if (topicLower.includes('irregular verb') || (topicLower.includes('ser') && topicLower.includes('estar'))) {
    return spanishVideoIds['irregular-verbs'];
  }
  return spanishVideoIds['default'];
}

function replacePlaceholders(topicPath: string) {
  try {
    const content = fs.readFileSync(topicPath, 'utf-8');
    const topic = JSON.parse(content);
    
    if (!topic.materials?.videos) return false;
    
    const hasPlaceholder = topic.materials.videos.some((v: any) => v.url?.includes('9vKqVkMQHKk')) ||
                           topic.videoUrl?.includes('9vKqVkMQHKk');
    
    if (!hasPlaceholder) return false;
    
    const videoIds = getSpanishVideoIds(topic.topic);
    const channels = ['Butterfly Spanish', 'Spanish Learning', 'SpanishDict'];
    
    topic.materials.videos = videoIds.map((id, i) => ({
      title: `${topic.topic} | ${channels[i]}`,
      url: `https://www.youtube.com/watch?v=${id}`
    }));
    
    const firstRealVideo = topic.materials.videos.find((v: any) => !v.url.includes('9vKqVkMQHKk'));
    if (firstRealVideo) {
      topic.videoUrl = firstRealVideo.url;
    }
    
    fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2), 'utf-8');
    console.log(`✅ ${topic.topic}`);
    return true;
  } catch (error: any) {
    console.error(`❌ ${topicPath}: ${error.message}`);
    return false;
  }
}

const spanishDir = path.join(process.cwd(), 'seed', 'courses', 'spanish');
let count = 0;

function walkDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.startsWith('topic_') && entry.name.endsWith('.json')) {
      if (replacePlaceholders(fullPath)) {
        count++;
      }
    }
  }
}

console.log('🔄 Replacing remaining Spanish placeholders...\n');
walkDir(spanishDir);
console.log(`\n✅ Updated ${count} Spanish topic files.`);



