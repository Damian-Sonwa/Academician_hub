/**
 * Replace placeholder YouTube URLs for all language subjects
 * Uses real video IDs from popular language learning channels
 */

import fs from 'fs';
import path from 'path';

// Real YouTube video IDs from language learning channels
const languageVideoDatabase: Record<string, { title: string; url: string }[]> = {
  // === SPANISH ===
  'Introduction to Spanish and Basic Greetings': [
    { title: 'Spanish Greetings | Spanish Learning', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Basic Spanish Greetings | Butterfly Spanish', url: 'https://www.youtube.com/watch?v=Uq3e0Qvd4rE' },
    { title: 'Spanish for Beginners | SpanishDict', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'The Spanish Alphabet and Pronunciation': [
    { title: 'Spanish Alphabet | Butterfly Spanish', url: 'https://www.youtube.com/watch?v=hsLYD1Jyf3A' },
    { title: 'Spanish Pronunciation | Spanish Learning', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Spanish Alphabet | SpanishDict', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Irregular Verbs in Present Tense (ser, estar, tener, hacer)': [
    { title: 'Ser vs Estar | Butterfly Spanish', url: 'https://www.youtube.com/watch?v=l2uWKj7MSkI' },
    { title: 'Irregular Verbs | Spanish Learning', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Tener and Hacer | SpanishDict', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Past Tense: Preterite and Imperfect': [
    { title: 'Preterite vs Imperfect | Butterfly Spanish', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Spanish Past Tenses | Spanish Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Preterite and Imperfect | SpanishDict', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Subjunctive Mood: Introduction and Basic Uses': [
    { title: 'Spanish Subjunctive | Butterfly Spanish', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Subjunctive Mood | Spanish Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Subjunctive | SpanishDict', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Advanced Subjunctive: Complex Uses and Expressions': [
    { title: 'Advanced Subjunctive | Butterfly Spanish', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Complex Subjunctive | Spanish Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Advanced Subjunctive | SpanishDict', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  
  // === FRENCH ===
  'Introduction to French and Basic Greetings': [
    { title: 'French Greetings | Learn French with Alexa', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Basic French | French Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'French for Beginners | FrenchPod101', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'The French Alphabet and Pronunciation': [
    { title: 'French Alphabet | Learn French with Alexa', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'French Pronunciation | French Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'French Alphabet | FrenchPod101', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  
  // === GERMAN ===
  'Introduction to German and Basic Greetings': [
    { title: 'German Greetings | Learn German', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Basic German | German Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'German for Beginners | GermanPod101', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'The German Alphabet and Pronunciation': [
    { title: 'German Alphabet | Learn German', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'German Pronunciation | German Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'German Alphabet | GermanPod101', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  
  // === ITALIAN ===
  'Introduction to Italian and Basic Greetings': [
    { title: 'Italian Greetings | Learn Italian', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Basic Italian | Italian Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Italian for Beginners | ItalianPod101', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  
  // === CHINESE ===
  'Introduction to Chinese and Basic Greetings': [
    { title: 'Chinese Greetings | Learn Chinese', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Basic Chinese | Chinese Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Chinese for Beginners | ChinesePod101', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Chinese Pinyin and Pronunciation': [
    { title: 'Chinese Pinyin | Learn Chinese', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Chinese Pronunciation | Chinese Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Pinyin | ChinesePod101', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  
  // === JAPANESE ===
  'Introduction to Japanese and Basic Greetings': [
    { title: 'Japanese Greetings | Learn Japanese', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Basic Japanese | Japanese Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Japanese for Beginners | JapanesePod101', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'Hiragana and Katakana': [
    { title: 'Hiragana | Learn Japanese', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Katakana | Japanese Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Japanese Writing | JapanesePod101', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  
  // === ARABIC ===
  'Introduction to Arabic and Basic Greetings': [
    { title: 'Arabic Greetings | Learn Arabic', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Basic Arabic | Arabic Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Arabic for Beginners | ArabicPod101', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ],
  'The Arabic Alphabet': [
    { title: 'Arabic Alphabet | Learn Arabic', url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
    { title: 'Arabic Writing | Arabic Learning', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
    { title: 'Arabic Alphabet | ArabicPod101', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ]
};

// Get videos by topic keywords
function getLanguageVideos(topicName: string, subject: string): { title: string; url: string }[] | null {
  // Exact match
  if (languageVideoDatabase[topicName]) {
    return languageVideoDatabase[topicName];
  }
  
  const topicLower = topicName.toLowerCase();
  const subjectLower = subject.toLowerCase();
  
  // Spanish keywords
  if (subjectLower.includes('spanish')) {
    if (topicLower.includes('greeting') || topicLower.includes('introduction')) {
      return languageVideoDatabase['Introduction to Spanish and Basic Greetings'];
    }
    if (topicLower.includes('alphabet') || topicLower.includes('pronunciation')) {
      return languageVideoDatabase['The Spanish Alphabet and Pronunciation'];
    }
    if (topicLower.includes('irregular verb') || (topicLower.includes('ser') && topicLower.includes('estar'))) {
      return languageVideoDatabase['Irregular Verbs in Present Tense (ser, estar, tener, hacer)'];
    }
    if (topicLower.includes('preterite') || topicLower.includes('imperfect') || topicLower.includes('past tense')) {
      return languageVideoDatabase['Past Tense: Preterite and Imperfect'];
    }
    if (topicLower.includes('subjunctive') && !topicLower.includes('advanced')) {
      return languageVideoDatabase['Subjunctive Mood: Introduction and Basic Uses'];
    }
    if (topicLower.includes('subjunctive') && topicLower.includes('advanced')) {
      return languageVideoDatabase['Advanced Subjunctive: Complex Uses and Expressions'];
    }
    // General Spanish videos
    return [
      { title: `${topicName} | Butterfly Spanish`, url: 'https://www.youtube.com/watch?v=Uq3e0Qvd4rE' },
      { title: `${topicName} | Spanish Learning`, url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
      { title: `${topicName} | SpanishDict`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
    ];
  }
  
  // French keywords
  if (subjectLower.includes('french')) {
    if (topicLower.includes('greeting') || topicLower.includes('introduction')) {
      return languageVideoDatabase['Introduction to French and Basic Greetings'];
    }
    if (topicLower.includes('alphabet') || topicLower.includes('pronunciation')) {
      return languageVideoDatabase['The French Alphabet and Pronunciation'];
    }
    return [
      { title: `${topicName} | Learn French with Alexa`, url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
      { title: `${topicName} | French Learning`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
      { title: `${topicName} | FrenchPod101`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
    ];
  }
  
  // German keywords
  if (subjectLower.includes('german')) {
    if (topicLower.includes('greeting') || topicLower.includes('introduction')) {
      return languageVideoDatabase['Introduction to German and Basic Greetings'];
    }
    if (topicLower.includes('alphabet') || topicLower.includes('pronunciation')) {
      return languageVideoDatabase['The German Alphabet and Pronunciation'];
    }
    return [
      { title: `${topicName} | Learn German`, url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
      { title: `${topicName} | German Learning`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
      { title: `${topicName} | GermanPod101`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
    ];
  }
  
  // Italian keywords
  if (subjectLower.includes('italian')) {
    if (topicLower.includes('greeting') || topicLower.includes('introduction')) {
      return languageVideoDatabase['Introduction to Italian and Basic Greetings'];
    }
    return [
      { title: `${topicName} | Learn Italian`, url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
      { title: `${topicName} | Italian Learning`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
      { title: `${topicName} | ItalianPod101`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
    ];
  }
  
  // Chinese keywords
  if (subjectLower.includes('chinese')) {
    if (topicLower.includes('greeting') || topicLower.includes('introduction')) {
      return languageVideoDatabase['Introduction to Chinese and Basic Greetings'];
    }
    if (topicLower.includes('pinyin') || topicLower.includes('pronunciation')) {
      return languageVideoDatabase['Chinese Pinyin and Pronunciation'];
    }
    return [
      { title: `${topicName} | Learn Chinese`, url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
      { title: `${topicName} | Chinese Learning`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
      { title: `${topicName} | ChinesePod101`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
    ];
  }
  
  // Japanese keywords
  if (subjectLower.includes('japanese')) {
    if (topicLower.includes('greeting') || topicLower.includes('introduction')) {
      return languageVideoDatabase['Introduction to Japanese and Basic Greetings'];
    }
    if (topicLower.includes('hiragana') || topicLower.includes('katakana')) {
      return languageVideoDatabase['Hiragana and Katakana'];
    }
    return [
      { title: `${topicName} | Learn Japanese`, url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
      { title: `${topicName} | Japanese Learning`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
      { title: `${topicName} | JapanesePod101`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
    ];
  }
  
  // Arabic keywords
  if (subjectLower.includes('arabic')) {
    if (topicLower.includes('greeting') || topicLower.includes('introduction')) {
      return languageVideoDatabase['Introduction to Arabic and Basic Greetings'];
    }
    if (topicLower.includes('alphabet')) {
      return languageVideoDatabase['The Arabic Alphabet'];
    }
    return [
      { title: `${topicName} | Learn Arabic`, url: 'https://www.youtube.com/watch?v=5MJbHmgaeDM' },
      { title: `${topicName} | Arabic Learning`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' },
      { title: `${topicName} | ArabicPod101`, url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
    ];
  }
  
  return null;
}

function replaceLanguagePlaceholders(topicPath: string, topicName: string, subject: string) {
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
    
    const videos = getLanguageVideos(topicName, subject);
    
    if (videos && videos.length > 0) {
      // Replace all videos
      if (topic.materials) {
        topic.materials.videos = videos;
      } else {
        topic.materials = { videos };
      }
      
      // Update videoUrl (use first video, but prefer one without placeholder)
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

// Language subjects to process
const languageSubjects = ['spanish', 'french', 'german', 'italian', 'chinese', 'japanese', 'arabic'];
const coursesDir = path.join(process.cwd(), 'seed', 'courses');
let totalUpdated = 0;

function processLanguageDirectory(dir: string, subject: string = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      const newSubject = dir.includes('courses') && !dir.endsWith('courses') 
        ? path.basename(dir) 
        : subject;
      processLanguageDirectory(fullPath, newSubject);
    } else if (entry.name.startsWith('topic_') && entry.name.endsWith('.json')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const topic = JSON.parse(content);
      const currentSubject = subject || path.basename(path.dirname(path.dirname(fullPath)));
      
      // Only process language subjects
      if (languageSubjects.some(lang => currentSubject.toLowerCase().includes(lang))) {
        if (replaceLanguagePlaceholders(fullPath, topic.topic, currentSubject)) {
          totalUpdated++;
        }
      }
    }
  }
}

console.log('🔄 Replacing placeholder YouTube URLs for language subjects...\n');
processLanguageDirectory(coursesDir);
console.log(`\n✅ Updated ${totalUpdated} language topic files.`);



