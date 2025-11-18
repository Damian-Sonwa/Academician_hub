/**
 * Assignment Generator
 * Creates progressively difficult assignments for each lesson
 */

import Assignment from '../models/Assignment';
import Lesson from '../models/Lesson';
import Course from '../models/Course';

interface AssignmentConfig {
  lessonOrder: number;
  lessonTitle: string;
  courseCategory: string;
  courseLevel: string;
}

// Generate assignment based on lesson order (progressive difficulty)
export function generateAssignmentForLesson(config: AssignmentConfig): any {
  const { lessonOrder, lessonTitle, courseCategory, courseLevel } = config;

  // Determine difficulty based on lesson order
  let difficulty: 'easy' | 'medium' | 'hard' | 'advanced';
  let questionCount: number;
  let totalPoints: number;
  let passingScore: number;

  if (lessonOrder === 1) {
    difficulty = 'easy';
    questionCount = 3;
    totalPoints = 10;
    passingScore = 60;
  } else if (lessonOrder <= 3) {
    difficulty = 'easy';
    questionCount = 4;
    totalPoints = 15;
    passingScore = 65;
  } else if (lessonOrder <= 5) {
    difficulty = 'medium';
    questionCount = 5;
    totalPoints = 20;
    passingScore = 70;
  } else if (lessonOrder <= 7) {
    difficulty = 'hard';
    questionCount = 6;
    totalPoints = 30;
    passingScore = 75;
  } else {
    difficulty = 'advanced';
    questionCount = 8;
    totalPoints = 40;
    passingScore = 80;
  }

  // Generate questions based on category
  const questions = generateQuestions(
    courseCategory,
    lessonTitle,
    difficulty,
    questionCount
  );

  return {
    title: `${lessonTitle} - Assessment`,
    description: `Test your understanding of ${lessonTitle}. Complete this assignment to unlock the next lesson.`,
    difficulty,
    duration: Math.ceil(questionCount * 2), // 2 minutes per question
    totalPoints,
    passingScore,
    questions,
    instructions: [
      'Read each question carefully',
      'Select the best answer for multiple choice questions',
      'For short answer questions, provide a clear and concise response',
      'You need a passing score to unlock the next lesson',
      'Review your answers before submitting',
    ],
    isOptional: false,
  };
}

function generateQuestions(
  category: string,
  lessonTitle: string,
  difficulty: 'easy' | 'medium' | 'hard' | 'advanced',
  count: number
): any[] {
  const questions: any[] = [];

  // Language Learning Questions
  if (category.toLowerCase() === 'languages') {
    if (lessonTitle.toLowerCase().includes('alphabet')) {
      questions.push({
        question: 'What is the correct order of learning the alphabet?',
        type: 'multiple-choice',
        options: [
          'A to Z sequentially',
          'Random letters',
          'Only vowels first',
          'Only consonants first',
        ],
        correctAnswer: 'A to Z sequentially',
        points: 2,
        explanation: 'Learning the alphabet sequentially helps with memory retention and understanding the structure.',
      });

      questions.push({
        question: 'Which letter comes after "E" in the alphabet?',
        type: 'multiple-choice',
        options: ['F', 'G', 'D', 'H'],
        correctAnswer: 'F',
        points: 1,
        explanation: 'The sequence is: A, B, C, D, E, F, G...',
      });

      questions.push({
        question: 'How many letters are in the English alphabet?',
        type: 'multiple-choice',
        options: ['24', '25', '26', '27'],
        correctAnswer: '26',
        points: 1,
        explanation: 'The English alphabet contains 26 letters from A to Z.',
      });
    }

    if (lessonTitle.toLowerCase().includes('greeting')) {
      questions.push({
        question: 'Which greeting is most appropriate in a formal setting?',
        type: 'multiple-choice',
        options: [
          'Hi',
          'Hello',
          'Hey',
          'What\'s up',
        ],
        correctAnswer: 'Hello',
        points: 2,
        explanation: '"Hello" is the most formal and polite greeting for professional settings.',
      });

      questions.push({
        question: 'When should you use "Good morning" vs "Good afternoon"?',
        type: 'multiple-choice',
        options: [
          'Morning: before noon, Afternoon: after noon',
          'Both are the same',
          'It depends on the season',
          'Either can be used anytime',
        ],
        correctAnswer: 'Morning: before noon, Afternoon: after noon',
        points: 2,
        explanation: 'Use "Good morning" before noon and "Good afternoon" from noon to evening.',
      });

      if (difficulty !== 'easy') {
        questions.push({
          question: 'What is an appropriate response to "How are you?" in a professional setting?',
          type: 'short-answer',
          correctAnswer: ['I\'m well, thank you', 'Fine, thanks', 'Good, and you?'],
          points: 2,
          explanation: 'Professional responses should be polite and considerate.',
        });
      }
    }
  }

  // Science Questions
  if (category.toLowerCase() === 'sciences') {
    if (lessonTitle.toLowerCase().includes('cell')) {
      questions.push({
        question: 'What is the basic unit of life?',
        type: 'multiple-choice',
        options: ['Atom', 'Cell', 'Molecule', 'Organ'],
        correctAnswer: 'Cell',
        points: 2,
        explanation: 'The cell is the basic structural and functional unit of all living organisms.',
      });

      questions.push({
        question: 'Which organelle is known as the powerhouses of the cell?',
        type: 'multiple-choice',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
        correctAnswer: 'Mitochondria',
        points: 2,
        explanation: 'Mitochondria produce ATP, the energy currency of the cell.',
      });

      if (difficulty !== 'easy') {
        questions.push({
          question: 'Compare prokaryotic and eukaryotic cells. What is the main difference?',
          type: 'short-answer',
          correctAnswer: ['Eukaryotic cells have a nucleus', 'Prokaryotic cells have no nucleus'],
          points: 3,
          explanation: 'Eukaryotic cells have a membrane-bound nucleus, while prokaryotic cells do not.',
        });
      }
    }
  }

  // Math Questions
  if (category.toLowerCase() === 'mathematics') {
    if (lessonTitle.toLowerCase().includes('algebra')) {
      questions.push({
        question: 'If x + 5 = 12, what is the value of x?',
        type: 'multiple-choice',
        options: ['7', '17', '60', '8'],
        correctAnswer: '7',
        points: 2,
        explanation: 'Subtract 5 from both sides: x = 12 - 5 = 7',
      });

      questions.push({
        question: 'What is the result of 3 × (4 + 2)?',
        type: 'multiple-choice',
        options: ['18', '14', '12', '24'],
        correctAnswer: '18',
        points: 2,
        explanation: 'Follow PEMDAS: 4 + 2 = 6, then 3 × 6 = 18',
      });
    }
  }

  // History Questions
  if (category.toLowerCase() === 'history') {
    questions.push({
      question: 'When did World War II end?',
      type: 'multiple-choice',
      options: ['1943', '1944', '1945', '1946'],
      correctAnswer: '1945',
      points: 2,
      explanation: 'World War II ended in 1945.',
    });
  }

  // Fill in any remaining slots with generic questions
  while (questions.length < count) {
    questions.push({
      question: `Based on the lesson "${lessonTitle}", explain your understanding of the key concepts.`,
      type: 'short-answer',
      correctAnswer: ['Demonstrates understanding of lesson concepts'],
      points: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4,
      explanation: 'This question evaluates your comprehension of the lesson material.',
    });
  }

  return questions.slice(0, count);
}

export async function createAssignmentForLesson(
  lessonId: string,
  courseId: string
): Promise<any> {
  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const config: AssignmentConfig = {
      lessonOrder: lesson.order,
      lessonTitle: lesson.title,
      courseCategory: course.category,
      courseLevel: course.level,
    };

    const assignmentData = generateAssignmentForLesson(config);

    const assignment = new Assignment({
      lessonId,
      courseId,
      ...assignmentData,
    });

    await assignment.save();
    return assignment;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
}

export async function createAssignmentsForAllLessons(): Promise<void> {
  try {
    const courses = await Course.find();
    
    for (const course of courses) {
      const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 });
      
      for (const lesson of lessons) {
        // Check if assignment already exists
        const existing = await Assignment.findOne({ lessonId: lesson._id });
        if (!existing) {
          await createAssignmentForLesson(lesson._id.toString(), course._id.toString());
          console.log(`✅ Created assignment for: ${lesson.title}`);
        }
      }
    }
    
    console.log('✅ All assignments created!');
  } catch (error) {
    console.error('Error creating assignments:', error);
    throw error;
  }
}

