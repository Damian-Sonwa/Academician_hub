/**
 * Generate detailed but concise content for all lessons
 * Creates comprehensive lesson content that's displayed when students click "Start"
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from './models/Lesson';
import Course from './models/Course';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evolve-hub';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env!');
  process.exit(1);
}

/**
 * Generate concise but detailed content for a lesson based on its title and course
 */
function generateLessonContent(title: string, courseCategory: string, courseLevel: string, order: number): string {
  const category = courseCategory.toLowerCase();
  const level = courseLevel.toLowerCase();
  
  // Base content structure: Introduction, Main Concepts, Examples, Summary
  let content = '';

  // Language Courses
  if (category === 'languages' || category === 'english') {
    if (title.toLowerCase().includes('alphabet') || title.toLowerCase().includes('basics')) {
      content = `# Introduction to ${title}

This foundational lesson introduces you to the building blocks of language learning. Understanding the alphabet and basic pronunciation is essential for developing reading, writing, and speaking skills.

## Key Concepts

The alphabet consists of letters that represent sounds. Each letter has a name and a sound, and learning these systematically helps build a strong foundation. Pronunciation varies between languages, so paying attention to sound differences is crucial.

## Learning Approach

Start by familiarizing yourself with each letter's appearance and sound. Practice writing each letter multiple times to develop muscle memory. Listen to native speakers pronounce each letter and repeat after them.

## Practical Application

Use flashcards to memorize letter-sound associations. Practice reading simple words that use the letters you've learned. Write short sentences using familiar letters to reinforce learning.

## Next Steps

Once comfortable with individual letters, you'll move on to combining them into words and understanding basic grammar rules. Regular practice is key to retention.`;
    } else if (title.toLowerCase().includes('greeting') || title.toLowerCase().includes('introduction')) {
      content = `# ${title}

Greetings and introductions are the first words you'll use in real conversations. They help you connect with others and show respect for the culture.

## Essential Phrases

Learn common greetings for different times of day: morning, afternoon, and evening. Practice formal and informal variations, as the context determines which to use. Introductions include stating your name and asking others' names politely.

## Cultural Context

Understanding when to use formal versus informal greetings shows cultural awareness. In many languages, the relationship between speakers determines the greeting style. Body language and tone also matter significantly.

## Practice Tips

Role-play conversations with greetings and introductions. Practice with different scenarios: meeting someone new, greeting a friend, or addressing someone formally. Record yourself to check pronunciation.

## Real-World Application

Use these phrases immediately in conversations, even if limited. Native speakers appreciate attempts to use their language, and practice builds confidence.`;
    } else if (title.toLowerCase().includes('grammar') || title.toLowerCase().includes('verb')) {
      content = `# ${title}

Grammar provides the structure that makes communication clear and meaningful. Understanding grammatical rules helps you construct correct sentences and express ideas accurately.

## Core Concepts

This lesson covers fundamental grammatical structures. Verbs show action or state, and their forms change based on tense, person, and number. Understanding these patterns is essential for sentence construction.

## Rules and Patterns

Learn the basic rules that govern sentence structure. Practice identifying subjects, verbs, and objects in sentences. Notice patterns in how words change form to show different meanings.

## Common Mistakes

Be aware of common errors learners make. Practice exercises help identify and correct mistakes. Understanding why errors occur helps prevent them in the future.

## Application

Apply grammar rules in writing and speaking exercises. Start with simple sentences and gradually increase complexity. Regular practice solidifies understanding.`;
    } else {
      content = `# ${title}

This lesson builds on previous knowledge to expand your language skills. Each new concept connects to what you've already learned, creating a comprehensive understanding of the language.

## Learning Objectives

By the end of this lesson, you'll understand key concepts and be able to apply them in practical situations. The material is designed to be immediately useful in real conversations.

## Main Content

The lesson covers essential vocabulary and structures relevant to ${title.toLowerCase()}. Practice exercises reinforce learning and help identify areas needing more attention.

## Examples and Practice

Work through provided examples to see concepts in action. Complete practice exercises to test your understanding. Review any challenging areas before moving forward.

## Summary

This lesson provides practical knowledge you can use immediately. Continue practicing to build fluency and confidence.`;
    }
  }
  
  // Science Courses (Biology, Chemistry, Physics)
  else if (category === 'science') {
    if (title.toLowerCase().includes('introduction') || title.toLowerCase().includes('basics')) {
      content = `# ${title}

This introductory lesson provides the foundation for understanding ${category}. Science helps us understand the natural world through observation, experimentation, and analysis.

## What You'll Learn

You'll explore fundamental concepts that form the basis of ${category}. Understanding these basics is essential before moving to more advanced topics. The concepts build upon each other systematically.

## Key Principles

Science follows specific methods and principles. Observations lead to questions, which lead to hypotheses that can be tested. Results are analyzed to draw conclusions and build knowledge.

## Real-World Applications

The concepts you learn have practical applications in daily life. Understanding these principles helps explain natural phenomena and solve real-world problems.

## Study Tips

Take notes on key concepts and definitions. Create diagrams to visualize relationships. Practice explaining concepts in your own words to ensure understanding.`;
    } else if (title.toLowerCase().includes('cell') || title.toLowerCase().includes('molecule') || title.toLowerCase().includes('atom')) {
      content = `# ${title}

This lesson explores the fundamental building blocks of matter and life. Understanding these microscopic structures is crucial for comprehending larger biological and chemical processes.

## Structure and Function

Learn about the components that make up these structures and how each part contributes to overall function. Structure determines function, and understanding this relationship is key.

## Key Components

Identify and understand the main parts of these structures. Each component has specific roles that work together to maintain proper function. Visual aids help conceptualize these tiny structures.

## Processes and Interactions

Explore how these structures interact with their environment. Understand the processes that occur within and between structures. These interactions are essential for life and chemical reactions.

## Practical Significance

This knowledge applies to understanding health, disease, and chemical reactions. Medical and scientific applications rely on understanding these fundamental structures.`;
    } else {
      content = `# ${title}

This lesson deepens your understanding of ${category} by exploring ${title.toLowerCase()}. The concepts build on previous lessons and prepare you for more advanced topics.

## Core Concepts

Learn the essential principles that govern this topic. Understanding these concepts is necessary for grasping more complex ideas that follow. Each concept connects to broader scientific understanding.

## Examples and Applications

Study real-world examples that illustrate these concepts. See how theoretical knowledge applies to practical situations. These applications make abstract concepts more concrete.

## Problem-Solving

Work through problems that require applying these concepts. Practice identifying which principles apply to different situations. Develop problem-solving strategies.

## Review and Practice

Review key points to reinforce learning. Complete practice exercises to test understanding. Identify areas needing additional study.`;
    }
  }
  
  // Mathematics
  else if (category === 'math' || category === 'mathematics') {
    if (title.toLowerCase().includes('introduction') || title.toLowerCase().includes('basics')) {
      content = `# ${title}

Mathematics is the language of patterns, relationships, and logical reasoning. This lesson introduces fundamental concepts that form the foundation for all mathematical learning.

## Why Math Matters

Math develops logical thinking and problem-solving skills applicable beyond mathematics. It helps understand patterns in the world and make informed decisions.

## Core Concepts

Learn basic mathematical concepts and operations. Understanding these fundamentals is essential before tackling more complex topics. Each concept builds systematically on previous knowledge.

## Problem-Solving Approach

Develop a systematic approach to solving problems. Break complex problems into manageable steps. Check your work to ensure accuracy.

## Practice and Application

Practice is essential for mathematical mastery. Work through examples step-by-step. Apply concepts to solve various types of problems.`;
    } else if (title.toLowerCase().includes('equation') || title.toLowerCase().includes('formula')) {
      content = `# ${title}

Equations and formulas are powerful tools for solving problems and expressing relationships. Understanding how to work with them is essential for mathematical proficiency.

## Understanding Equations

An equation shows that two expressions are equal. Solving equations means finding values that make the equation true. Different types of equations require different solution methods.

## Solution Methods

Learn systematic methods for solving equations. Follow step-by-step procedures to isolate variables. Check solutions by substituting back into the original equation.

## Applications

Equations model real-world situations. Translate word problems into equations. Solve to find answers to practical questions.

## Practice Problems

Work through various problem types to build confidence. Start with simpler problems and progress to more complex ones. Regular practice improves problem-solving speed and accuracy.`;
    } else {
      content = `# ${title}

This lesson explores important mathematical concepts that build on previous learning. Understanding these topics enhances your mathematical skills and problem-solving abilities.

## Key Concepts

Learn the essential principles and methods for this topic. Each concept connects to broader mathematical understanding. Mastery of these concepts prepares you for advanced topics.

## Step-by-Step Learning

Follow clear explanations of concepts and procedures. Work through examples to see methods in action. Practice applying concepts to solve problems.

## Common Applications

See how these mathematical concepts apply to real situations. Understanding applications makes abstract concepts more meaningful. These applications demonstrate math's practical value.

## Mastery Through Practice

Regular practice is essential for mathematical success. Work through exercises of increasing difficulty. Review and correct mistakes to improve understanding.`;
    }
  }
  
  // Programming Courses
  else if (category === 'webdev' || category === 'python' || category === 'cybersecurity') {
    if (title.toLowerCase().includes('introduction') || title.toLowerCase().includes('basics')) {
      content = `# ${title}

Welcome to ${category}! This foundational lesson introduces you to essential concepts and tools you'll use throughout your learning journey.

## Getting Started

Learn the basic concepts and terminology used in ${category}. Understanding these fundamentals is crucial before writing code or building projects. Set up your development environment to begin practicing.

## Core Concepts

Explore the fundamental principles that guide ${category} development. These concepts apply across different projects and technologies. A solid foundation makes learning advanced topics easier.

## Your First Steps

Complete hands-on exercises to apply what you're learning. Start with simple examples and gradually increase complexity. Practice regularly to build confidence and skills.

## Tools and Resources

Familiarize yourself with essential tools and resources. Learn where to find documentation and help. Build a toolkit of resources for future reference.

## Next Steps

This lesson provides the foundation for everything that follows. Continue practicing and building on these basics.`;
    } else if (title.toLowerCase().includes('syntax') || title.toLowerCase().includes('variables') || title.toLowerCase().includes('function')) {
      content = `# ${title}

This lesson covers essential programming concepts that form the building blocks of code. Understanding these fundamentals is necessary for writing effective programs.

## Core Concepts

Learn the syntax and rules that govern how code is written. Variables store data, functions perform actions, and understanding these concepts enables you to write meaningful code.

## Syntax and Structure

Study the correct syntax for writing code. Pay attention to details like punctuation and formatting. Proper syntax is essential for code to work correctly.

## Practical Examples

Work through examples that demonstrate these concepts in action. Write code yourself to reinforce learning. Experiment with variations to deepen understanding.

## Common Patterns

Learn common patterns and best practices. Understanding patterns helps you write better code. These patterns appear frequently in real-world programming.

## Practice Exercises

Complete coding exercises to apply your knowledge. Start with guided exercises and progress to independent problem-solving. Debugging errors teaches valuable skills.`;
    } else {
      content = `# ${title}

This lesson builds on previous programming knowledge to explore more advanced concepts. Each new topic connects to what you've already learned.

## Learning Objectives

By completing this lesson, you'll understand key concepts and be able to implement them in code. The material is practical and immediately applicable.

## Concepts and Implementation

Learn the theory behind the concepts, then see how to implement them in code. Understanding both theory and practice is important for mastery.

## Hands-On Practice

Write code to practice what you're learning. Start with provided examples, then modify them. Create your own variations to test understanding.

## Real-World Applications

See how these concepts are used in actual projects. Understanding applications helps you know when and how to use what you've learned.

## Building Skills

Continue practicing to build programming skills. Each lesson adds new tools to your programming toolkit.`;
    }
  }
  
  // History and Geography
  else if (category === 'history' || category === 'geography') {
    content = `# ${title}

This lesson explores important ${category} topics that help us understand the world and its development over time.

## Historical/Geographical Context

Understanding context is essential for comprehending ${category}. Events and places don't exist in isolation but are part of larger patterns and systems.

## Key Events/Features

Learn about significant events, places, or features relevant to this topic. Understanding these elements provides insight into broader ${category} themes.

## Causes and Effects

Explore the relationships between causes and effects. Understanding these connections helps explain how and why things happened or exist.

## Significance

Consider why this topic matters. Understanding significance helps you remember and apply what you've learned. These topics connect to larger themes.

## Learning Approach

Take notes on key facts and dates. Create timelines or maps to visualize information. Connect new information to what you already know.`;
  }
  
  // Default content for any other category
  else {
    content = `# ${title}

This lesson provides comprehensive coverage of ${title.toLowerCase()}, building essential knowledge and skills in this area.

## Introduction

Welcome to this important lesson. The content is designed to be clear, practical, and immediately applicable. You'll gain both theoretical understanding and practical skills.

## Core Content

The lesson covers essential concepts and information you need to understand. Each concept builds on previous knowledge and prepares you for more advanced topics.

## Key Learning Points

Focus on understanding the main ideas and how they connect. Take notes on important points. Ask questions about anything unclear.

## Practical Application

See how the concepts apply in real situations. Understanding applications makes the material more meaningful and memorable.

## Summary

This lesson provides a solid foundation in ${title.toLowerCase()}. Continue practicing and reviewing to reinforce your learning.`;
  }

  return content;
}

/**
 * Update all lessons with generated content
 */
async function generateContentForAllLessons() {
  try {
    console.log('🌱 Starting lesson content generation...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all lessons
    const lessons = await Lesson.find({});
    console.log(`📚 Found ${lessons.length} lessons to process\n`);

    let updated = 0;
    let skipped = 0;

    for (const lesson of lessons) {
      // Get course information
      const course = await Course.findById(lesson.courseId);
      
      if (!course) {
        console.log(`⚠️  Skipping lesson "${lesson.title}" - course not found`);
        skipped++;
        continue;
      }

      // Check if lesson already has detailed content
      const hasContent = lesson.content && lesson.content.length > 200;
      
      if (hasContent) {
        console.log(`⏭️  Skipping "${lesson.title}" - already has content`);
        skipped++;
        continue;
      }

      // Generate content
      const generatedContent = generateLessonContent(
        lesson.title,
        course.category,
        course.level,
        lesson.order
      );

      // Update lesson
      lesson.content = generatedContent;
      await lesson.save();

      console.log(`✅ Updated: "${lesson.title}" (${course.category} - ${course.level})`);
      updated++;
    }

    console.log('\n🎉 Content generation completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Lessons updated: ${updated}`);
    console.log(`   - Lessons skipped: ${skipped}`);
    console.log(`   - Total processed: ${lessons.length}`);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Generation error:', error);
    process.exit(1);
  }
}

generateContentForAllLessons();



