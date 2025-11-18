import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course';
import Lesson from './models/Lesson';
import Achievement from './models/Achievement';
import User from './models/User';
import Alphabet from './models/Alphabet';
import { getTextbookForCourse, openTextbooks } from './utils/opentextbook';
import { generateLessonsForCourse } from './utils/lessonGenerator';
import { getLessonContent, getEducationalImage } from './utils/lessonContent';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/evolve-hub';

// Helper function to extract language name from course title
function getLanguageFromCourseTitle(title: string): string | null {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('spanish')) return 'Spanish';
  if (titleLower.includes('french')) return 'French';
  if (titleLower.includes('german')) return 'German';
  if (titleLower.includes('mandarin') || titleLower.includes('chinese')) return 'Chinese';
  if (titleLower.includes('japanese')) return 'Japanese';
  if (titleLower.includes('arabic')) return 'Arabic';
  if (titleLower.includes('italian')) return 'Italian';
  if (titleLower.includes('english')) return 'English';
  return null;
}

// Helper function to create alphabet content for lesson
function createAlphabetLessonContent(alphabet: any): string {
  let content = `${alphabet.description}\n\n`;
  
  if (alphabet.specialNotes) {
    content += `📝 Special Notes: ${alphabet.specialNotes}\n\n`;
  }
  
  content += `## Letters\n\n`;
  alphabet.letters.forEach((letter: any, index: number) => {
    content += `**${letter.char}** - ${letter.pronunciation}`;
    if ((index + 1) % 5 === 0) {
      content += `\n`;
    } else {
      content += ` | `;
    }
  });
  
  content += `\n\n## Numbers\n\n`;
  alphabet.numbers.forEach((number: any) => {
    content += `**${number.char}** - ${number.text} (${number.pronunciation})\n`;
  });
  
  return content;
}

const courses = [
  // Computer Science Courses
  {
    title: 'Python Programming Basics',
    description: 'Learn Python from scratch: variables, loops, functions, and object-oriented programming.',
    category: 'python',
    level: 'Junior',
    instructor: 'Alex Johnson',
    duration: '6 weeks',
    enrolled: 5678,
    imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    isPremium: false,
  },
  {
    title: 'Advanced Python: Data Science',
    description: 'Master NumPy, Pandas, Matplotlib, and machine learning libraries for data analysis.',
    category: 'python',
    level: 'Advanced',
    instructor: 'Dr. Nina Patel',
    duration: '12 weeks',
    enrolled: 1234,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    isPremium: true,
  },

  // English/Arts Courses
  {
    title: 'Creative Writing Workshop',
    description: 'Develop your writing skills through storytelling, character development, and narrative techniques.',
    category: 'english',
    level: 'Junior',
    instructor: 'Emma Williams',
    duration: '8 weeks',
    enrolled: 987,
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    isPremium: false,
  },
  {
    title: 'English Literature: Shakespeare',
    description: 'Explore the works of William Shakespeare through detailed analysis of his major plays and sonnets.',
    category: 'english',
    level: 'Secondary',
    instructor: 'Prof. Henry Morgan',
    duration: '10 weeks',
    enrolled: 654,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    isPremium: true,
  },

  // Language Learning Courses
  {
    title: 'Spanish for Beginners',
    description: 'Start your Spanish journey! Learn basic vocabulary, grammar, pronunciation, and conversational skills.',
    category: 'languages',
    level: 'Junior',
    instructor: 'María García',
    duration: '10 weeks',
    enrolled: 2145,
    imageUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80',
    isPremium: false,
  },
  {
    title: 'Intermediate Spanish Conversation',
    description: 'Improve your Spanish fluency with real-world conversations, idiomatic expressions, and cultural insights.',
    category: 'languages',
    level: 'Secondary',
    instructor: 'Carlos Rodríguez',
    duration: '12 weeks',
    enrolled: 1234,
    imageUrl: 'https://images.unsplash.com/photo-1519668552395-367e4d4c542e?w=800&q=80',
    isPremium: true,
  },
  {
    title: 'Advanced Spanish',
    description: 'Master advanced Spanish grammar, literature, business communication, and regional variations. Perfect for professional and academic contexts.',
    category: 'languages',
    level: 'Advanced',
    instructor: 'Ana Martínez',
    duration: '14 weeks',
    enrolled: 856,
    imageUrl: 'https://images.unsplash.com/photo-1519668552395-367e4d4c542e?w=800&q=80',
    isPremium: true,
  },
  {
    title: 'French Fundamentals',
    description: 'Discover the beauty of French! Master pronunciation, essential grammar, and everyday phrases.',
    category: 'languages',
    level: 'Junior',
    instructor: 'Sophie Dubois',
    duration: '10 weeks',
    enrolled: 1876,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    isPremium: false,
  },
  {
    title: 'Advanced French Literature',
    description: 'Explore French literature, analyze classic and contemporary texts, and refine your language mastery.',
    category: 'languages',
    level: 'Advanced',
    instructor: 'Pierre Laurent',
    duration: '14 weeks',
    enrolled: 654,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    isPremium: true,
  },
  {
    title: 'German Language Basics',
    description: 'Learn German from scratch! Build a strong foundation in grammar, vocabulary, and pronunciation.',
    category: 'languages',
    level: 'Junior',
    instructor: 'Hans Müller',
    duration: '10 weeks',
    enrolled: 1432,
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
    isPremium: false,
  },
  {
    title: 'Business German',
    description: 'Master professional German for the workplace, including business writing, presentations, and negotiations.',
    category: 'languages',
    level: 'Secondary',
    instructor: 'Anna Schmidt',
    duration: '12 weeks',
    enrolled: 876,
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    isPremium: true,
  },
  {
    title: 'Mandarin Chinese for Beginners',
    description: 'Start learning Mandarin! Master Pinyin, tones, basic characters, and essential conversation skills.',
    category: 'languages',
    level: 'Junior',
    instructor: 'Li Wei',
    duration: '12 weeks',
    enrolled: 1987,
    imageUrl: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800&q=80',
    isPremium: false,
  },
  {
    title: 'Japanese Language & Culture',
    description: 'Learn Japanese through the lens of culture. Study Hiragana, Katakana, Kanji, and cultural traditions.',
    category: 'languages',
    level: 'Junior',
    instructor: 'Yuki Tanaka',
    duration: '12 weeks',
    enrolled: 2345,
    imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    isPremium: false,
  },
  {
    title: 'Arabic for Travelers',
    description: 'Learn practical Arabic for travel and everyday situations. Focus on Modern Standard Arabic.',
    category: 'languages',
    level: 'Junior',
    instructor: 'Ahmed Hassan',
    duration: '8 weeks',
    enrolled: 987,
    imageUrl: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800&q=80',
    isPremium: false,
  },
  {
    title: 'Italian Conversation Practice',
    description: 'Practice speaking Italian with confidence! Focus on conversational fluency and cultural understanding.',
    category: 'languages',
    level: 'Secondary',
    instructor: 'Giulia Rossi',
    duration: '10 weeks',
    enrolled: 1123,
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80',
    isPremium: true,
  },

  // Cybersecurity Courses - All Levels
  {
    title: 'Introduction to Cybersecurity',
    description: 'Overview of cybersecurity, why it matters, types of cyber threats, and common security principles.',
    category: 'cybersecurity',
    level: 'Junior',
    instructor: 'Alex Security',
    duration: '8 weeks',
    enrolled: 2156,
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    isPremium: false,
  },
  {
    title: 'Web Application Security',
    description: 'Covers SQL injection, XSS, CSRF, authentication flaws, and OWASP Top 10.',
    category: 'cybersecurity',
    level: 'Secondary',
    instructor: 'Alex Security',
    duration: '10 weeks',
    enrolled: 1123,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    isPremium: true,
  },
  // Cloud Computing Courses
  {
    title: 'Cloud Computing Fundamentals',
    description: 'Learn the basics of cloud computing, including service models, deployment models, and major cloud providers. Perfect for beginners starting their cloud journey.',
    category: 'computer',
    level: 'Junior',
    instructor: 'Sarah Cloud',
    duration: '10 weeks',
    enrolled: 1456,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    isPremium: false,
  },
  {
    title: 'Intermediate Cloud Computing',
    description: 'Deep dive into cloud services, containerization, serverless computing, and cloud architecture patterns. Build practical skills with AWS, Azure, and GCP.',
    category: 'computer',
    level: 'Secondary',
    instructor: 'Sarah Cloud',
    duration: '12 weeks',
    enrolled: 892,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    isPremium: true,
  },
  {
    title: 'Advanced Cloud Computing',
    description: 'Master multi-cloud architectures, advanced Kubernetes, cloud-native development, and enterprise cloud governance. Prepare for senior cloud engineering roles.',
    category: 'computer',
    level: 'Advanced',
    instructor: 'Sarah Cloud',
    duration: '14 weeks',
    enrolled: 567,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    isPremium: true,
  },
  // Cybersecurity Courses
  {
    title: 'Cybersecurity Fundamentals',
    description: 'Learn the basics of cybersecurity, including common threats, password security, malware protection, and safe browsing practices. Perfect for beginners starting their cybersecurity journey.',
    category: 'cybersecurity',
    level: 'Junior',
    instructor: 'Alex Security',
    duration: '10 weeks',
    enrolled: 2341,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    isPremium: false,
  },
  {
    title: 'Intermediate Cybersecurity',
    description: 'Deep dive into network security, vulnerability assessment, cryptography, and security architecture. Build practical skills in penetration testing and security operations.',
    category: 'cybersecurity',
    level: 'Secondary',
    instructor: 'Alex Security',
    duration: '12 weeks',
    enrolled: 1234,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    isPremium: true,
  },
  {
    title: 'Advanced Cybersecurity',
    description: 'Master advanced threat detection, security operations centers, incident response, and security leadership. Prepare for senior cybersecurity roles and certifications.',
    category: 'cybersecurity',
    level: 'Advanced',
    instructor: 'Alex Security',
    duration: '14 weeks',
    enrolled: 789,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    isPremium: true,
  },
  // Full Stack Development Courses
  {
    title: 'Full Stack Development Fundamentals',
    description: 'Learn the fundamentals of full stack development including HTML, CSS, JavaScript, Node.js, APIs, and databases. Build your first complete web application from frontend to backend.',
    category: 'computer',
    level: 'Junior',
    instructor: 'Jamie Developer',
    duration: '10 weeks',
    enrolled: 3456,
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    isPremium: false,
  },
  {
    title: 'Intermediate Full Stack Development',
    description: 'Master React, Express.js, database integration, authentication, and testing. Build scalable full stack applications with modern tools and best practices.',
    category: 'computer',
    level: 'Secondary',
    instructor: 'Jamie Developer',
    duration: '12 weeks',
    enrolled: 2134,
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    isPremium: true,
  },
  {
    title: 'Advanced Full Stack Development',
    description: 'Master advanced concepts including Redux, GraphQL, microservices, Docker, WebSockets, and enterprise architecture. Build production-ready, scalable applications.',
    category: 'computer',
    level: 'Advanced',
    instructor: 'Jamie Developer',
    duration: '14 weeks',
    enrolled: 987,
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    isPremium: true,
  },
  // Mobile Development Courses
  {
    title: 'Mobile Development Fundamentals',
    description: 'Learn the fundamentals of mobile development including React Native, mobile UI/UX design, navigation, state management, and API integration. Build your first mobile application for iOS and Android.',
    category: 'computer',
    level: 'Junior',
    instructor: 'Alex Mobile',
    duration: '10 weeks',
    enrolled: 2345,
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    isPremium: false,
  },
  {
    title: 'Intermediate Mobile Development',
    description: 'Master advanced React Native, animations, offline storage, push notifications, authentication, and advanced navigation. Build production-ready mobile applications with modern tools.',
    category: 'computer',
    level: 'Secondary',
    instructor: 'Alex Mobile',
    duration: '12 weeks',
    enrolled: 1654,
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    isPremium: true,
  },
  {
    title: 'Advanced Mobile Development',
    description: 'Master enterprise mobile architecture, native modules, advanced performance optimization, security, microservices integration, and enterprise deployment. Build scalable, production-ready mobile applications.',
    category: 'computer',
    level: 'Advanced',
    instructor: 'Alex Mobile',
    duration: '14 weeks',
    enrolled: 876,
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    isPremium: true,
  },
];

const achievements = [
  {
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    category: 'learning',
    xpReward: 10,
    condition: { type: 'lessons_completed', value: 1 },
    rarity: 'common',
  },
  {
    name: 'Quick Learner',
    description: 'Complete 5 lessons in a single day',
    icon: '⚡',
    category: 'learning',
    xpReward: 50,
    condition: { type: 'daily_lessons', value: 5 },
    rarity: 'rare',
  },
  {
    name: 'Course Crusher',
    description: 'Complete your first course',
    icon: '🏆',
    category: 'milestone',
    xpReward: 100,
    condition: { type: 'courses_completed', value: 1 },
    rarity: 'rare',
  },
  {
    name: 'Perfect Score',
    description: 'Score 100% on a quiz',
    icon: '💯',
    category: 'learning',
    xpReward: 75,
    condition: { type: 'perfect_quiz_score', value: 100 },
    rarity: 'epic',
  },
  {
    name: 'Knowledge Seeker',
    description: 'Enroll in 5 different courses',
    icon: '📚',
    category: 'learning',
    xpReward: 50,
    condition: { type: 'courses_enrolled', value: 5 },
    rarity: 'common',
  },
  {
    name: 'Level Master',
    description: 'Reach level 10',
    icon: '⭐',
    category: 'milestone',
    xpReward: 150,
    condition: { type: 'level_reached', value: 10 },
    rarity: 'epic',
  },
  {
    name: 'Community Helper',
    description: 'Answer 10 questions in discussions',
    icon: '🤝',
    category: 'social',
    xpReward: 50,
    condition: { type: 'answers_posted', value: 10 },
    rarity: 'rare',
  },
  {
    name: 'Project Master',
    description: 'Submit 3 projects',
    icon: '🚀',
    category: 'learning',
    xpReward: 100,
    condition: { type: 'projects_submitted', value: 3 },
    rarity: 'epic',
  },
  {
    name: 'Streak Master',
    description: 'Maintain a 30-day learning streak',
    icon: '🔥',
    category: 'milestone',
    xpReward: 200,
    condition: { type: 'daily_streak', value: 30 },
    rarity: 'legendary',
  },
  {
    name: 'Scholar',
    description: 'Complete 10 courses',
    icon: '🎓',
    category: 'milestone',
    xpReward: 500,
    condition: { type: 'courses_completed', value: 10 },
    rarity: 'legendary',
  },
];

async function seed() {
  try {
    console.log('🌱 Starting seed process...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Ensure alphabets are seeded first
    console.log('🔤 Checking alphabet data...');
    const alphabetCount = await Alphabet.countDocuments();
    if (alphabetCount === 0) {
      console.log('⚠️  No alphabet data found. Please run: npm run seed:alphabets');
      console.log('   Continuing with course seeding...');
    } else {
      console.log(`✅ Found ${alphabetCount} languages with alphabet data`);
    }

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Achievement.deleteMany({});
    
    // Insert courses
    console.log('📚 Inserting courses...');
    
    // Enrich courses with OpenTextbook data
    const enrichedCourses: any[] = [];
    
    for (const course of courses) {
      // Try to get matching OpenTextbook (all courses are in English)
      const textbook = getTextbookForCourse(course.category, course.level, 'English');
      const enrichedCourse: any = { ...course };
      
      if (textbook) {
        enrichedCourse.textbookTitle = textbook.title;
        enrichedCourse.textbookUrl = textbook.url;
        enrichedCourse.textbookLicense = textbook.license;
        enrichedCourse.textbookAttribution = textbook.attribution;
        enrichedCourse.textbookAuthor = textbook.author;
        enrichedCourse.textbookSource = 'OpenTextbook';
      }
      
      enrichedCourses.push(enrichedCourse);
    }
    
    const insertedCourses = await Course.insertMany(enrichedCourses);
    console.log(`✅ Inserted ${insertedCourses.length} courses with OpenTextbook resources`);

    // Create lessons for each course using smart lesson generator
    console.log('📝 Creating subject-specific lessons for courses...');
    let totalLessons = 0;
    
    for (const course of insertedCourses) {
      console.log(`  📚 Generating lessons for: ${course.title}...`);
      
      // Generate subject-specific lessons
      const generatedLessons = generateLessonsForCourse(
        course.category,
        course.level,
        course.title
      );
      
      // Add courseId, order, and enrich with comprehensive content where available
      const lessons = generatedLessons.map(async (lesson, index) => {
        let lessonContent = lesson.content;
        let lessonDescription = lesson.description;
        
        // For language courses at Junior level, enrich first lesson with alphabet data
        if (course.category === 'languages' && course.level === 'Junior' && index === 0) {
          const languageName = getLanguageFromCourseTitle(course.title);
          if (languageName) {
            const alphabetData = await Alphabet.findOne({ 
              language: new RegExp(`^${languageName}$`, 'i') 
            });
            
            if (alphabetData) {
              console.log(`    📚 Enriching first lesson with ${languageName} alphabet data...`);
              lessonContent = createAlphabetLessonContent(alphabetData);
              lessonDescription = `Learn the ${languageName} alphabet, pronunciation, and numbers. ${alphabetData.description}`;
            } else {
              console.log(`    ⚠️  No alphabet data found for ${languageName}, using default content`);
            }
          }
        } else {
          // Try to get comprehensive lesson content for non-alphabet lessons
          const comprehensiveContent = getLessonContent(course.category, lesson.title);
          if (comprehensiveContent) {
            lessonContent = comprehensiveContent.detailedContent;
            lessonDescription = comprehensiveContent.summary;
          }
        }
        
        // Get educational image for this lesson topic (skip for Spanish lessons)
        let lessonImage = '';
        if (!course.title.toLowerCase().includes('spanish')) {
          lessonImage = getEducationalImage(lesson.title);
        }
        
        // Build lesson object ensuring quiz and assignments are included
        const lessonData: any = {
          ...lesson,
          courseId: (course._id as any).toString(),
          order: index + 1,
          videoUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, // Placeholder video URL
          imageUrl: lessonImage, // Main lesson image (empty for Spanish)
          images: [], // Additional images (empty for Spanish)
          content: lessonContent,
          description: lessonDescription,
        };
        
        // Explicitly include quiz and assignments if they exist
        if (lesson.quiz) {
          lessonData.quiz = lesson.quiz;
          // Debug: Log quiz structure for Spanish lessons
          if (course.title.toLowerCase().includes('spanish') && index === 0) {
            console.log(`✅ Quiz saved for lesson: ${lessonData.title}`);
            console.log(`   Quiz structure:`, JSON.stringify(lessonData.quiz, null, 2).substring(0, 200));
          }
        }
        if (lesson.assignments && lesson.assignments.length > 0) {
          lessonData.assignments = lesson.assignments;
          // Debug: Log assignments structure for Spanish lessons
          if (course.title.toLowerCase().includes('spanish') && index === 0) {
            console.log(`✅ Assignments saved for lesson: ${lessonData.title}`);
            console.log(`   Assignments count: ${lessonData.assignments.length}`);
            console.log(`   First assignment:`, lessonData.assignments[0]?.title);
          }
        }
        
        return lessonData;
      });
      
      // Wait for all lessons to be processed (in case of async alphabet lookup)
      const processedLessons = await Promise.all(lessons);

      await Lesson.insertMany(processedLessons);
      totalLessons += processedLessons.length;
      console.log(`    ✓ Created ${processedLessons.length} lessons with images and detailed content`);
    }
    console.log(`✅ Created ${totalLessons} total lessons across all courses`);

    // Insert achievements
    console.log('🏆 Inserting achievements...');
    const insertedAchievements = await Achievement.insertMany(achievements);
    console.log(`✅ Inserted ${insertedAchievements.length} achievements`);

    // Create demo user
    console.log('👤 Creating demo user...');
    const demoUser = await User.findOne({ email: 'demo@example.com' });
    
    if (!demoUser) {
      await User.create({
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'password123',
        role: 'admin',
        level: 5,
        xp: 450,
        badges: ['🎓 Newcomer', '🎯 First Steps', '📚 Knowledge Seeker'],
      });
      console.log('✅ Demo user created (email: demo@example.com, password: password123, role: admin)');
    } else {
      // Update existing demo user to have admin role
      await User.updateOne(
        { email: 'demo@example.com' },
        { $set: { role: 'admin' } }
      );
      console.log('ℹ️  Demo user already exists - updated to admin role');
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log(`
📊 Summary:
  - Courses: ${insertedCourses.length}
  - Lessons: ${totalLessons}
  - Achievements: ${insertedAchievements.length}
  
🔐 Demo Account:
  - Email: demo@example.com
  - Password: password123
    `);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

function getModuleName(category: string, lessonNumber: number): string {
  const modules: Record<string, string[]> = {
    science: [
      'Introduction to Cells',
      'DNA and Genetics',
      'Evolution and Natural Selection',
      'Ecology and Ecosystems',
      'The Human Body Systems',
      'Microbiology',
      'Plant Biology',
      'Animal Behavior',
      'Biochemistry Basics',
      'Scientific Method',
    ],
    math: [
      'Number Systems',
      'Algebraic Expressions',
      'Equations and Inequalities',
      'Functions and Graphs',
      'Polynomials',
      'Rational Expressions',
      'Exponential Functions',
      'Logarithms',
      'Sequences and Series',
      'Problem Solving Strategies',
    ],
    python: [
      'Python Basics',
      'Data Types and Variables',
      'Control Flow',
      'Functions',
      'Lists and Tuples',
      'Dictionaries',
      'Object-Oriented Programming',
      'File Handling',
      'Error Handling',
      'Modules and Packages',
    ],
    webdev: [
      'HTML Fundamentals',
      'CSS Styling',
      'Responsive Design',
      'JavaScript Basics',
      'DOM Manipulation',
      'APIs and Fetch',
      'React Components',
      'State Management',
      'Backend with Node.js',
      'Database Integration',
    ],
    english: [
      'Grammar Fundamentals',
      'Writing Techniques',
      'Literary Devices',
      'Poetry Analysis',
      'Essay Writing',
      'Character Development',
      'Narrative Structure',
      'Rhetorical Analysis',
      'Critical Reading',
      'Creative Expression',
    ],
    history: [
      'Early Civilizations',
      'Classical Antiquity',
      'Medieval Period',
      'Renaissance',
      'Industrial Revolution',
      'World Wars',
      'Cold War Era',
      'Modern History',
      'Cultural Movements',
      'Historical Analysis',
    ],
    geography: [
      'Earth Systems',
      'Climate and Weather',
      'Landforms',
      'Water Resources',
      'Population Geography',
      'Urban Development',
      'Economic Geography',
      'Cultural Landscapes',
      'Environmental Issues',
      'Geographic Information Systems',
    ],
  };

  const categoryModules = modules[category] || modules['science'];
  return categoryModules[(lessonNumber - 1) % categoryModules.length];
}

// Run seed
seed();

