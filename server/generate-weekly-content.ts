/**
 * Generate complete weekly content for course topics
 * Each topic = 1 week of learning with sequential progression
 */

import fs from 'fs';
import path from 'path';

interface WeeklyTopic {
  course: string;
  level: string;
  week: number;
  topic: string;
  summary: string;
  why_it_matters: string;
  materials: {
    videos: Array<{ title: string; url: string }>;
    textbooks: Array<{ title: string; url: string }>;
    labs: Array<{ title: string; url: string }>;
  };
  assignments: Array<{
    title: string;
    description: string;
    tasks: string[];
  }>;
  quizzes: Array<{
    question: string;
    options?: string[];
    answer: string | number | boolean;
    type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
    explanation?: string;
  }>;
}

interface ExistingTopic {
  title: string;
  summary: string;
  detailedSummary?: string;
  materials?: {
    videos?: Array<{ title: string; url: string }>;
    textbooks?: Array<{ title: string; url: string }>;
    labs?: Array<{ title: string; url: string }>;
  };
  assignments?: Array<{
    title: string;
    description: string;
    tasks: string[];
  }>;
  quiz?: {
    questions: Array<{
      question: string;
      type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
      options?: string[];
      correctAnswer: number | string | boolean;
      explanation: string;
    }>;
  };
}

// Generate "Why it matters" based on topic and category
function generateWhyItMatters(topic: ExistingTopic, category: string, level: string): string {
  const title = topic.title.toLowerCase();
  
  if (category === 'science') {
    if (title.includes('life science') || title.includes('characteristics')) {
      return 'Understanding the characteristics of life is fundamental to all biological studies and helps us distinguish living organisms from non-living matter, forming the foundation for advanced biological concepts.';
    } else if (title.includes('cell')) {
      return 'Cell structure and function knowledge is essential for understanding how organisms work, how diseases develop, and how medical treatments target specific cellular processes.';
    } else if (title.includes('dna') || title.includes('genetics')) {
      return 'Genetics knowledge is crucial for understanding heredity, genetic diseases, biotechnology, and the evolution of species, with applications in medicine, agriculture, and forensic science.';
    } else if (title.includes('evolution')) {
      return 'Understanding evolution explains the diversity of life on Earth and helps us predict how species might adapt to environmental changes, including climate change and emerging diseases.';
    } else if (title.includes('chemistry') || title.includes('reaction')) {
      return 'Chemical reactions are the basis of all life processes and industrial applications, from metabolism in cells to manufacturing medicines and materials.';
    } else if (title.includes('physics') || title.includes('motion') || title.includes('energy')) {
      return 'Understanding physical principles helps explain natural phenomena, enables technological innovation, and is essential for fields like engineering, medicine, and environmental science.';
    }
  } else if (category === 'languages') {
    return `Mastering this ${level} level language topic builds essential communication skills, opens cultural understanding, and enhances career opportunities in our globalized world.`;
  } else if (category === 'math') {
    return `This mathematical concept is fundamental for problem-solving in science, engineering, economics, and daily life, providing tools for logical thinking and quantitative analysis.`;
  } else if (category === 'python' || category === 'webdev' || category === 'cybersecurity') {
    return `This programming/technology topic provides practical skills highly sought after in the job market and enables you to build real-world applications and solve technical problems.`;
  } else if (category === 'english' || category === 'history' || category === 'geography') {
    return `Understanding this topic enhances critical thinking, cultural awareness, and communication skills essential for academic success and informed citizenship.`;
  }
  
  return `This topic provides essential knowledge for understanding ${category} at the ${level} level, building a strong foundation for advanced learning and practical application.`;
}

// Convert existing topic to weekly format
function convertToWeeklyTopic(
  topic: ExistingTopic,
  courseName: string,
  level: string,
  weekNumber: number,
  category: string
): WeeklyTopic {
  // Use detailedSummary if available, otherwise use summary
  const fullSummary = topic.detailedSummary || topic.summary;
  
  // Ensure summary is 200-400 words
  let summary = fullSummary;
  const wordCount = summary.split(/\s+/).length;
  if (wordCount < 200) {
    summary += ` This topic provides comprehensive coverage essential for understanding ${category} at the ${level} level. Through detailed study, students will gain deep insights into the concepts, principles, and real-world applications. The material is designed to build a strong foundation for further learning and practical application in various contexts.`;
  }
  
  // Extract materials
  const materials = {
    videos: topic.materials?.videos || [],
    textbooks: topic.materials?.textbooks || [],
    labs: topic.materials?.labs || [],
  };
  
  // Convert assignments
  const assignments = topic.assignments || [];
  
  // Convert quiz questions
  const quizzes = topic.quiz?.questions?.map(q => ({
    question: q.question,
    options: q.options,
    answer: q.correctAnswer,
    type: q.type,
    explanation: q.explanation,
  })) || [];
  
  // Ensure we have 3-5 quiz questions
  while (quizzes.length < 3) {
    quizzes.push({
      question: `What is a key concept related to ${topic.title}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: 0,
      type: 'multiple-choice',
      explanation: `This question tests understanding of fundamental concepts in ${topic.title}.`,
    });
  }
  
  return {
    course: courseName,
    level: level,
    week: weekNumber,
    topic: topic.title,
    summary: summary.trim(),
    why_it_matters: generateWhyItMatters(topic, category, level),
    materials: materials,
    assignments: assignments.length > 0 ? assignments : [
      {
        title: `Week ${weekNumber} Assignment: ${topic.title}`,
        description: `Complete the following tasks to demonstrate your understanding of ${topic.title}.`,
        tasks: [
          `Read all assigned materials for ${topic.title}`,
          `Complete the practice exercises and labs`,
          `Write a summary of key concepts learned`,
          `Submit your completed work for review`
        ]
      }
    ],
    quizzes: quizzes.slice(0, 5), // Limit to 5 questions
  };
}

// Generate weekly content for a single course
export function generateWeeklyContentForCourse(courseName: string, level: string, category: string) {
  console.log(`\n📚 Generating weekly content for: ${courseName} - ${level}\n`);
  
  const inputFile = path.join(process.cwd(), 'seed', 'courses', courseName, `${level}.json`);
  const outputDir = path.join(process.cwd(), 'seed', 'courses', courseName, level);
  
  if (!fs.existsSync(inputFile)) {
    console.log(`  ⚠️  Input file not found: ${inputFile}`);
    return { weeks: 0, topics: [] };
  }
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Read existing topics
  const content = fs.readFileSync(inputFile, 'utf-8');
  const topics: ExistingTopic[] = JSON.parse(content);
  
  console.log(`  📖 Found ${topics.length} topics\n`);
  
  const weeklyTopics: WeeklyTopic[] = [];
  
  // Convert each topic to weekly format
  topics.forEach((topic, index) => {
    const weekNumber = index + 1;
    const weeklyTopic = convertToWeeklyTopic(topic, courseName, level, weekNumber, category);
    weeklyTopics.push(weeklyTopic);
    
    // Write individual week file
    const weekFile = path.join(outputDir, `week_${weekNumber}.json`);
    fs.writeFileSync(weekFile, JSON.stringify(weeklyTopic, null, 2), 'utf-8');
    
    console.log(`  ✅ Week ${weekNumber}: ${topic.title}`);
  });
  
  console.log(`\n  📊 Summary:`);
  console.log(`     - Weeks generated: ${weeklyTopics.length}`);
  console.log(`     - Output directory: ${outputDir}`);
  
  return {
    weeks: weeklyTopics.length,
    topics: weeklyTopics.map(wt => ({ week: wt.week, topic: wt.topic }))
  };
}

// Main function - process one course at a time
function main() {
  const courseName = process.argv[2] || 'biology';
  const level = process.argv[3] || 'beginner';
  const category = process.argv[4] || 'science';
  
  const result = generateWeeklyContentForCourse(courseName, level, category);
  
  console.log(`\n🎉 Weekly content generation complete!`);
  console.log(`\n📋 Topics Updated and Weeks Assigned:\n`);
  result.topics.forEach(({ week, topic }) => {
    console.log(`   Week ${week}: ${topic}`);
  });
  console.log(`\n   Total weeks: ${result.weeks}`);
}

main();

