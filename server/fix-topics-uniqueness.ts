import fs from 'fs';
import path from 'path';

// Unique image pools for different subjects to avoid duplication
const ENGLISH_IMAGES = [
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca750da1c7?w=800&q=80',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  'https://images.unsplash.com/photo-1532619675605-1ede6c9ed2d9?w=800&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80',
  'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80',
  'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80',
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
  'https://images.unsplash.com/photo-1618519764620-7403abdbdfe0?w=800&q=80',
  'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80',
  'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=800&q=80',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
];

const MATH_IMAGES = [
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
  'https://images.unsplash.com/photo-1574170275470-a717198122c8?w=800&q=80',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&q=80',
  'https://images.unsplash.com/photo-1635070041074-30f7d032490d?w=800&q=80',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&q=80',
];

let imageIndex = 0;
const usedImages = new Set<string>();

function getUniqueImage(imagePool: string[]): string {
  let attempts = 0;
  while (attempts < imagePool.length * 2) {
    const image = imagePool[imageIndex % imagePool.length];
    imageIndex++;
    if (!usedImages.has(image)) {
      usedImages.add(image);
      return image;
    }
    attempts++;
  }
  // If all images used, reset and reuse
  const image = imagePool[imageIndex % imagePool.length];
  imageIndex++;
  return image;
}

function getAdditionalImages(imagePool: string[], mainImage: string, count: number = 2): string[] {
  const additional: string[] = [];
  for (let i = 0; i < count; i++) {
    let img = getUniqueImage(imagePool);
    while (img === mainImage || additional.includes(img)) {
      img = getUniqueImage(imagePool);
    }
    additional.push(img);
  }
  return additional;
}

// Topic-specific content generators
function generateFullTopicLesson(topic: string, subject: string): any {
  // This will be filled with topic-specific content based on the topic title
  // For now, return a template structure
  return {
    definitions: {},
    keyConcepts: [],
    stepByStepExplanations: [],
    examples: [],
    realLifeApplications: [],
    diagramsOrImageDescriptions: [],
    codeSamples: []
  };
}

function generateMarkingGuide(topic: string): any {
  return {
    quizGrading: "Each multiple-choice question is worth 1 point. True/false questions are worth 1 point. Short-answer questions require complete and accurate responses. Total points vary by quiz length. Passing: 70%."
  };
}

// Process a single topic file
function processTopicFile(filePath: string, subject: string, level: string): void {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const topicData = JSON.parse(content);
    
    // Skip if already has fullTopicLesson and markingGuide
    if (topicData.fullTopicLesson && topicData.markingGuide) {
      console.log(`✓ Already complete: ${topicData.topic}`);
      return;
    }

    // Get unique images
    const imagePool = subject === 'english' ? ENGLISH_IMAGES : MATH_IMAGES;
    const mainImage = getUniqueImage(imagePool);
    const additionalImages = getAdditionalImages(imagePool, mainImage);

    // Update images
    topicData.images = {
      main: mainImage,
      additional: additionalImages
    };

    // Add fullTopicLesson if missing
    if (!topicData.fullTopicLesson) {
      topicData.fullTopicLesson = generateFullTopicLesson(topicData.topic, subject);
    }

    // Add markingGuide if missing
    if (!topicData.markingGuide) {
      topicData.markingGuide = generateMarkingGuide(topicData.topic);
    }

    // Write back
    fs.writeFileSync(filePath, JSON.stringify(topicData, null, 2) + '\n', 'utf-8');
    console.log(`✓ Updated: ${topicData.topic}`);
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error);
  }
}

// Main function
function main() {
  const coursesDir = path.join(process.cwd(), 'seed', 'courses');
  
  // Process English topics
  const englishDir = path.join(coursesDir, 'english');
  if (fs.existsSync(englishDir)) {
    console.log('\n📚 Processing English topics...\n');
    
    ['secondary', 'advanced'].forEach(level => {
      const levelDir = path.join(englishDir, level);
      if (fs.existsSync(levelDir)) {
        const files = fs.readdirSync(levelDir)
          .filter(f => f.startsWith('topic_') && f.endsWith('.json'))
          .sort();
        
        files.forEach(file => {
          const filePath = path.join(levelDir, file);
          processTopicFile(filePath, 'english', level);
        });
      }
    });
  }

  // Process Mathematics topics
  const mathDir = path.join(coursesDir, 'mathematics');
  if (fs.existsSync(mathDir)) {
    console.log('\n📐 Processing Mathematics topics...\n');
    
    ['secondary', 'advanced'].forEach(level => {
      const levelDir = path.join(mathDir, level);
      if (fs.existsSync(levelDir)) {
        const files = fs.readdirSync(levelDir)
          .filter(f => f.startsWith('topic_') && f.endsWith('.json'))
          .sort();
        
        files.forEach(file => {
          const filePath = path.join(levelDir, file);
          processTopicFile(filePath, 'mathematics', level);
        });
      }
    });
  }

  console.log('\n✅ Batch update complete!\n');
}

main();



