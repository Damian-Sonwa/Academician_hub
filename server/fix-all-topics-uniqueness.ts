import fs from 'fs';
import path from 'path';

// Expanded unique image pools
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
  'https://images.unsplash.com/photo-1635070041074-30f7d032490d?w=800&q=80',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
  'https://images.unsplash.com/photo-1574170275470-a717198122c8?w=800&q=80',
];

const MATH_IMAGES = [
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
  'https://images.unsplash.com/photo-1574170275470-a717198122c8?w=800&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&q=80',
  'https://images.unsplash.com/photo-1635070041074-30f7d032490d?w=800&q=80',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&q=80',
  'https://images.unsplash.com/photo-1635070041074-30f7d032490d?w=800&q=80',
];

const imageUsageMap = new Map<string, Set<string>>(); // topic -> set of used images

function getUniqueImage(imagePool: string[], topicTitle: string): string {
  if (!imageUsageMap.has(topicTitle)) {
    imageUsageMap.set(topicTitle, new Set());
  }
  const used = imageUsageMap.get(topicTitle)!;
  
  // Try to find an unused image
  for (const img of imagePool) {
    if (!used.has(img)) {
      used.add(img);
      return img;
    }
  }
  
  // If all used, pick one that's least used across all topics
  const usageCount = new Map<string, number>();
  imageUsageMap.forEach((usedSet) => {
    usedSet.forEach((img) => {
      usageCount.set(img, (usageCount.get(img) || 0) + 1);
    });
  });
  
  let leastUsed = imagePool[0];
  let minCount = usageCount.get(leastUsed) || 0;
  for (const img of imagePool) {
    const count = usageCount.get(img) || 0;
    if (count < minCount) {
      minCount = count;
      leastUsed = img;
    }
  }
  
  used.add(leastUsed);
  return leastUsed;
}

function getAdditionalImages(imagePool: string[], mainImage: string, topicTitle: string, count: number = 2): string[] {
  const additional: string[] = [];
  for (let i = 0; i < count; i++) {
    let img = getUniqueImage(imagePool, topicTitle);
    let attempts = 0;
    while ((img === mainImage || additional.includes(img)) && attempts < imagePool.length * 2) {
      img = getUniqueImage(imagePool, topicTitle);
      attempts++;
    }
    additional.push(img);
  }
  return additional;
}

// Generate topic-specific content based on topic title
function generateTopicSpecificContent(topicTitle: string, detailedSummary: string, subject: string): any {
  const topicLower = topicTitle.toLowerCase();
  
  // Extract key terms from topic
  const keyTerms: string[] = [];
  const words = topicTitle.split(/[:,\s]+/);
  words.forEach(word => {
    const clean = word.toLowerCase().replace(/[^\w]/g, '');
    if (clean.length > 3 && !['the', 'and', 'for', 'with', 'from', 'that', 'this'].includes(clean)) {
      keyTerms.push(clean);
    }
  });

  // Generate definitions based on topic
  const definitions: Record<string, string> = {};
  if (topicLower.includes('grammar') || topicLower.includes('parts of speech')) {
    definitions['Noun'] = 'A word that names a person, place, thing, or idea.';
    definitions['Verb'] = 'A word that expresses action or state of being.';
    definitions['Adjective'] = 'A word that modifies or describes a noun.';
  } else if (topicLower.includes('poetry') || topicLower.includes('poem')) {
    definitions['Stanza'] = 'A group of lines in a poem, separated by blank lines.';
    definitions['Rhyme Scheme'] = 'The pattern of end rhymes in a poem, indicated by letters.';
    definitions['Meter'] = 'The rhythmic pattern of stressed and unstressed syllables.';
  } else if (topicLower.includes('shakespeare')) {
    definitions['Blank Verse'] = 'Unrhymed iambic pentameter, Shakespeare\'s primary verse form.';
    definitions['Soliloquy'] = 'A speech where a character speaks thoughts aloud, typically alone on stage.';
    definitions['Pun'] = 'Wordplay exploiting multiple meanings of words.';
  } else if (topicLower.includes('literature') || topicLower.includes('literary')) {
    definitions['Plot'] = 'The sequence of events in a story.';
    definitions['Character'] = 'A person, animal, or entity in a story.';
    definitions['Theme'] = 'The central message or insight about life that the author conveys.';
  } else if (topicLower.includes('writing') && topicLower.includes('paragraph')) {
    definitions['Topic Sentence'] = 'The sentence in a paragraph that states the main idea.';
    definitions['Supporting Sentences'] = 'Sentences that provide evidence and details.';
    definitions['Coherence'] = 'The logical flow between sentences in a paragraph.';
  } else if (topicLower.includes('essay') || topicLower.includes('thesis')) {
    definitions['Thesis Statement'] = 'A sentence presenting the main argument of an essay.';
    definitions['Body Paragraph'] = 'A paragraph that develops one aspect of the thesis.';
    definitions['Introduction'] = 'The opening section of an essay that provides context and thesis.';
  } else if (topicLower.includes('research') || topicLower.includes('citation')) {
    definitions['Primary Source'] = 'Original materials such as texts, manuscripts, or historical documents.';
    definitions['Secondary Source'] = 'Materials that analyze or interpret primary sources.';
    definitions['Citation'] = 'A reference to a source used in research.';
  } else if (topicLower.includes('rhetoric') || topicLower.includes('persuasive')) {
    definitions['Ethos'] = 'Appeal to credibility and character.';
    definitions['Pathos'] = 'Appeal to emotion.';
    definitions['Logos'] = 'Appeal to logic and reason.';
  } else if (topicLower.includes('vocabulary') || topicLower.includes('word')) {
    definitions['Etymology'] = 'The study of word origins and history.';
    definitions['Root Word'] = 'The core part of a word that carries its main meaning.';
    definitions['Prefix'] = 'A word part added to the beginning of a word.';
  } else if (topicLower.includes('media') || topicLower.includes('news')) {
    definitions['Media Literacy'] = 'The ability to access, analyze, evaluate, and create media.';
    definitions['Bias'] = 'A perspective or prejudice that influences how information is presented.';
    definitions['Fact-Checking'] = 'The process of verifying claims using reliable sources.';
  } else if (topicLower.includes('public speaking') || topicLower.includes('presentation')) {
    definitions['Introduction'] = 'The opening of a speech that grabs attention and previews main points.';
    definitions['Body'] = 'The main section of a speech with supporting points.';
    definitions['Conclusion'] = 'The closing that summarizes and provides a final thought.';
  } else if (topicLower.includes('creative writing')) {
    definitions['Plot'] = 'The sequence of events in a story.';
    definitions['Character Development'] = 'The process of creating complex, believable characters.';
    definitions['Show, Don\'t Tell'] = 'Using specific details and actions instead of stating emotions directly.';
  } else if (topicLower.includes('linguistics') || topicLower.includes('language structure')) {
    definitions['Phonetics'] = 'The study of speech sounds and their production.';
    definitions['Syntax'] = 'The study of sentence structure and grammar rules.';
    definitions['Semantics'] = 'The study of meaning in language.';
  } else if (topicLower.includes('translation') || topicLower.includes('adaptation')) {
    definitions['Translation'] = 'The process of converting text from one language to another.';
    definitions['Adaptation'] = 'Transforming a work across different media or contexts.';
    definitions['Fidelity'] = 'Faithfulness to the original work in translation or adaptation.';
  } else if (topicLower.includes('digital humanities') || topicLower.includes('text analysis')) {
    definitions['Distant Reading'] = 'Analyzing large text corpora computationally.';
    definitions['Text Mining'] = 'Extracting information and patterns from texts.';
    definitions['Topic Modeling'] = 'Identifying recurring themes across text collections.';
  } else if (topicLower.includes('professional writing') || topicLower.includes('technical')) {
    definitions['Technical Writing'] = 'Writing that explains complex information clearly.';
    definitions['Audience Analysis'] = 'Understanding readers\' needs, knowledge, and goals.';
    definitions['Clarity'] = 'Using simple, direct language to communicate effectively.';
  } else if (topicLower.includes('comparative literature')) {
    definitions['Comparative Literature'] = 'The study of literature across national and cultural boundaries.';
    definitions['Influence Studies'] = 'Examining how authors and works influence each other.';
    definitions['Thematic Comparison'] = 'Comparing how different cultures address similar themes.';
  } else if (topicLower.includes('postcolonial')) {
    definitions['Postcolonial Literature'] = 'Literature from formerly colonized regions addressing colonial effects.';
    definitions['Hybridity'] = 'Cultural mixing and blending in postcolonial contexts.';
    definitions['Subaltern'] = 'Marginalized voices excluded from dominant discourse.';
  } else if (topicLower.includes('modernist') || topicLower.includes('postmodernist')) {
    definitions['Modernism'] = 'Early 20th century literary movement experimenting with form.';
    definitions['Stream-of-Consciousness'] = 'Narrative technique presenting characters\' thoughts in flowing style.';
    definitions['Postmodernism'] = 'Mid-20th century movement questioning reality and fixed meanings.';
  } else if (topicLower.includes('world literature')) {
    definitions['World Literature'] = 'Literary works from diverse cultures and regions globally.';
    definitions['Translation'] = 'Converting works from one language to another.';
    definitions['Cultural Context'] = 'The historical and social background influencing literature.';
  } else if (topicLower.includes('literary theory') || topicLower.includes('criticism')) {
    definitions['Literary Theory'] = 'Frameworks for interpreting and analyzing literature.';
    definitions['Formalism'] = 'Focus on the text itself, separate from context.';
    definitions['Feminist Criticism'] = 'Analysis examining gender roles and power dynamics.';
  } else if (topicLower.includes('capstone') || topicLower.includes('research project')) {
    definitions['Capstone Project'] = 'Independent research project demonstrating mastery of studies.';
    definitions['Literature Review'] = 'Survey of existing scholarship on a topic.';
    definitions['Methodology'] = 'The systematic approach used to conduct research.';
  } else {
    // Generic fallback
    definitions['Key Concept 1'] = 'A fundamental idea related to this topic.';
    definitions['Key Concept 2'] = 'An important principle in this area of study.';
    definitions['Key Concept 3'] = 'A core element essential to understanding this topic.';
  }

  // Generate key concepts from summary
  const keyConcepts: string[] = [];
  const sentences = detailedSummary.split(/[.!?]+/).filter(s => s.trim().length > 20);
  sentences.slice(0, 5).forEach(sentence => {
    const trimmed = sentence.trim();
    if (trimmed.length > 0) {
      keyConcepts.push(trimmed.substring(0, 100) + (trimmed.length > 100 ? '...' : ''));
    }
  });

  // Generate step-by-step explanations
  const stepByStepExplanations: string[] = [
    `**Understanding ${keyTerms[0] || 'the topic'}:** ${detailedSummary.substring(0, 150)}...`,
    `**Applying concepts:** Practice with examples specific to ${topicTitle}.`,
    `**Mastering skills:** Develop proficiency through structured exercises.`
  ];

  // Generate examples
  const examples: string[] = [
    `**Example 1:** A practical illustration of ${keyTerms[0] || 'key concepts'} in action.`,
    `**Example 2:** Another scenario demonstrating ${keyTerms[1] || 'important principles'}.`,
    `**Example 3:** A real-world application of ${keyTerms[2] || 'these concepts'}.`
  ];

  // Generate real-life applications
  const realLifeApplications: string[] = [
    `**Academic Context:** ${topicTitle} is essential for academic success and scholarly work.`,
    `**Professional Use:** These skills apply directly to professional communication and analysis.`,
    `**Personal Development:** Understanding ${topicTitle} enhances critical thinking and expression.`
  ];

  // Generate diagram descriptions
  const diagramsOrImageDescriptions: string[] = [
    `A visual diagram illustrating key concepts of ${topicTitle}.`,
    `A flowchart showing the process and relationships in ${topicTitle}.`
  ];

  return {
    definitions,
    keyConcepts: keyConcepts.length > 0 ? keyConcepts : [
      `Understanding ${keyTerms[0] || 'fundamental concepts'}`,
      `Applying ${keyTerms[1] || 'key principles'}`,
      `Mastering ${keyTerms[2] || 'essential skills'}`
    ],
    stepByStepExplanations,
    examples,
    realLifeApplications,
    diagramsOrImageDescriptions,
    codeSamples: subject === 'mathematics' || topicLower.includes('programming') ? [] : []
  };
}

function processTopicFile(filePath: string, subject: string, level: string): void {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const topicData = JSON.parse(content);
    
    const topicTitle = topicData.topic || '';
    
    // Skip if already has fullTopicLesson and markingGuide AND has unique images
    if (topicData.fullTopicLesson && topicData.markingGuide && topicData.images?.main) {
      // Check if images are unique (not the default repeated ones)
      const mainImg = topicData.images.main;
      if (!mainImg.includes('photo-1456513080510') && !mainImg.includes('photo-1481627834876') && 
          !mainImg.includes('photo-1503676260728') && !mainImg.includes('photo-1513475382585')) {
        console.log(`✓ Already complete with unique images: ${topicTitle}`);
        return;
      }
    }

    // Get unique images
    const imagePool = subject === 'english' ? ENGLISH_IMAGES : MATH_IMAGES;
    const mainImage = getUniqueImage(imagePool, topicTitle);
    const additionalImages = getAdditionalImages(imagePool, mainImage, topicTitle);

    // Update images
    topicData.images = {
      main: mainImage,
      additional: additionalImages
    };

    // Add fullTopicLesson if missing or incomplete
    if (!topicData.fullTopicLesson || Object.keys(topicData.fullTopicLesson.definitions || {}).length === 0) {
      topicData.fullTopicLesson = generateTopicSpecificContent(
        topicTitle,
        topicData.detailedSummary || '',
        subject
      );
    }

    // Add markingGuide if missing
    if (!topicData.markingGuide) {
      const quizCount = topicData.quizzes?.length || 5;
      topicData.markingGuide = {
        quizGrading: `Each multiple-choice question is worth 1 point. True/false questions are worth 1 point. Short-answer questions require complete and accurate responses. Total: ${quizCount} points. Passing: ${Math.ceil(quizCount * 0.7)}/${quizCount} (70%).`
      };
    }

    // Write back
    fs.writeFileSync(filePath, JSON.stringify(topicData, null, 2) + '\n', 'utf-8');
    console.log(`✓ Updated: ${topicTitle}`);
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error);
  }
}

// Main function
function main() {
  console.log('\n🔧 Starting batch update of all topics...\n');
  
  const coursesDir = path.join(process.cwd(), 'seed', 'courses');
  
  // Process English topics
  const englishDir = path.join(coursesDir, 'english');
  if (fs.existsSync(englishDir)) {
    console.log('📚 Processing English topics...\n');
    
    ['secondary', 'advanced'].forEach(level => {
      const levelDir = path.join(englishDir, level);
      if (fs.existsSync(levelDir)) {
        const files = fs.readdirSync(levelDir)
          .filter(f => f.startsWith('topic_') && f.endsWith('.json'))
          .sort((a, b) => {
            const numA = parseInt(a.match(/topic_(\d+)/)?.[1] || '0');
            const numB = parseInt(b.match(/topic_(\d+)/)?.[1] || '0');
            return numA - numB;
          });
        
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
          .sort((a, b) => {
            const numA = parseInt(a.match(/topic_(\d+)/)?.[1] || '0');
            const numB = parseInt(b.match(/topic_(\d+)/)?.[1] || '0');
            return numA - numB;
          });
        
        files.forEach(file => {
          const filePath = path.join(levelDir, file);
          processTopicFile(filePath, 'mathematics', level);
        });
      }
    });
  }

  console.log('\n✅ Batch update complete!\n');
  console.log(`📊 Total unique images used: ${imageUsageMap.size} topics processed\n`);
}

main();



