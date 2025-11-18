import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Course from './models/Course';
import Progress from './models/Progress';
import Notification from './models/Notification';
import Subscription from './models/Subscription';
import Project from './models/Project';
import Message from './models/Message';
import UserAchievement from './models/UserAchievement';
import Achievement from './models/Achievement';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Academicians';

async function seedAllCollections() {
  try {
    console.log('🌱 Starting comprehensive seed for all collections...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB:', mongoose.connection.name);

    // Get existing users and courses
    const users = await User.find().limit(10);
    const courses = await Course.find().limit(10);
    
    if (users.length === 0 || courses.length === 0) {
      console.log('⚠️  No users or courses found. Run "npm run seed" first!');
      process.exit(1);
    }

    console.log(`👥 Found ${users.length} users`);
    console.log(`📚 Found ${courses.length} courses`);

    // 1. Seed Progress (if not exists)
    console.log('\n📊 Seeding Progress...');
    const existingProgress = await Progress.countDocuments();
    if (existingProgress === 0) {
      const progressData = users.slice(0, 5).flatMap(user =>
        courses.slice(0, 3).map(course => ({
          userId: user._id.toString(),
          courseId: course._id.toString(),
          completedLessons: [],
          currentLesson: null,
          progress: Math.floor(Math.random() * 100),
          xpEarned: Math.floor(Math.random() * 500),
          timeSpent: Math.floor(Math.random() * 3600),
          lastAccessed: new Date(),
        }))
      );
      await Progress.insertMany(progressData);
      console.log(`✅ Created ${progressData.length} progress entries`);
    } else {
      console.log(`✅ Progress already exists (${existingProgress} entries)`);
    }

    // 2. Seed Notifications
    console.log('\n🔔 Seeding Notifications...');
    await Notification.deleteMany({});
    const notificationData = users.slice(0, 5).flatMap(user => [
      {
        userId: user._id.toString(),
        type: 'achievement' as const,
        title: '🏆 Achievement Unlocked!',
        message: 'You earned the "First Steps" achievement!',
        isRead: false,
        icon: '🏆',
      },
      {
        userId: user._id.toString(),
        type: 'success' as const,
        title: '📚 New Course Available',
        message: 'A new lesson has been added to your enrolled course.',
        isRead: Math.random() > 0.5,
        icon: '📚',
      },
      {
        userId: user._id.toString(),
        type: 'info' as const,
        title: '✨ Welcome!',
        message: 'Welcome to the learning platform!',
        isRead: true,
        icon: '✨',
      },
    ]);
    await Notification.insertMany(notificationData);
    console.log(`✅ Created ${notificationData.length} notifications`);

    // 3. Seed Subscriptions
    console.log('\n💳 Seeding Subscriptions...');
    await Subscription.deleteMany({});
    const subscriptionData = users.slice(0, 5).map((user, idx) => ({
      userId: user._id.toString(),
      plan: idx % 3 === 0 ? 'premium' as const : idx % 3 === 1 ? 'pro' as const : 'free' as const,
      status: 'active' as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      autoRenew: true,
    }));
    await Subscription.insertMany(subscriptionData);
    console.log(`✅ Created ${subscriptionData.length} subscriptions`);

    // 4. Seed Projects
    console.log('\n🚀 Seeding Projects...');
    await Project.deleteMany({});
    const projectData = users.slice(0, 5).flatMap((user, userIdx) => [
      {
        userId: user._id.toString(),
        courseId: courses[userIdx % courses.length]._id.toString(),
        title: `My ${courses[userIdx % courses.length].title} Project`,
        description: 'A comprehensive project demonstrating my learning progress.',
        content: 'This project demonstrates my understanding of the course material through practical application. I have implemented key concepts learned throughout the course and created a working solution that showcases my skills.',
        technologies: ['JavaScript', 'React', 'Node.js'],
        status: 'submitted' as const,
        grade: Math.floor(Math.random() * 30) + 70,
        feedback: 'Great work! Keep it up!',
        submittedAt: new Date(),
      },
      {
        userId: user._id.toString(),
        courseId: courses[(userIdx + 1) % courses.length]._id.toString(),
        title: `Advanced ${courses[(userIdx + 1) % courses.length].title} Project`,
        description: 'An advanced project showcasing advanced concepts.',
        content: 'This is an advanced project that goes beyond the basic requirements. I have incorporated advanced techniques and best practices learned in the course.',
        technologies: ['TypeScript', 'Next.js', 'MongoDB'],
        status: 'draft' as const,
      },
    ]);
    await Project.insertMany(projectData);
    console.log(`✅ Created ${projectData.length} projects`);

    // 5. Seed Messages
    console.log('\n💬 Seeding Messages...');
    const existingMessages = await Message.countDocuments();
    if (existingMessages < 10) {
      await Message.deleteMany({});
      const messageData = [];
      const roomIds = ['general', 'course-discussion', 'study-group-1', 'study-group-2'];
      for (let i = 0; i < 20; i++) {
        const sender = users[i % users.length];
        const roomId = roomIds[i % roomIds.length];
        messageData.push({
          roomId: roomId,
          userId: sender._id.toString(),
          userName: sender.name,
          content: `Hello! This is message #${i + 1} from ${sender.name}`,
          type: 'text' as const,
          isEdited: false,
        });
      }
      await Message.insertMany(messageData);
      console.log(`✅ Created ${messageData.length} messages`);
    } else {
      console.log(`✅ Messages already exist (${existingMessages} messages)`);
    }

    // 6. Seed UserAchievements
    console.log('\n🏆 Seeding UserAchievements...');
    await UserAchievement.deleteMany({});
    const achievements = await Achievement.find().limit(5);
    const userAchievementData = users.slice(0, 5).flatMap(user =>
      achievements.slice(0, 3).map((achievement, idx) => ({
        userId: user._id.toString(),
        achievementId: achievement._id.toString(),
        unlockedAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000),
      }))
    );
    await UserAchievement.insertMany(userAchievementData);
    console.log(`✅ Created ${userAchievementData.length} user achievements`);

    // 7. Create additional collections schemas and seed
    
    // Posts Collection
    console.log('\n📝 Seeding Posts...');
    const PostSchema = new mongoose.Schema({
      userId: String,
      courseId: String,
      title: String,
      content: String,
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now },
    });
    const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
    await Post.deleteMany({});
    const postData = users.slice(0, 5).flatMap((user, idx) => [
      {
        userId: user._id.toString(),
        courseId: courses[idx % courses.length]._id.toString(),
        title: `My Learning Journey in ${courses[idx % courses.length].title}`,
        content: 'I am really enjoying this course and learning so much!',
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20),
      },
      {
        userId: user._id.toString(),
        courseId: courses[(idx + 1) % courses.length]._id.toString(),
        title: `Tips for ${courses[(idx + 1) % courses.length].title}`,
        content: 'Here are some tips that helped me succeed in this course...',
        likes: Math.floor(Math.random() * 30),
        comments: Math.floor(Math.random() * 10),
      },
    ]);
    await Post.insertMany(postData);
    console.log(`✅ Created ${postData.length} posts`);

    // Discussions Collection
    console.log('\n💭 Seeding Discussions...');
    const DiscussionSchema = new mongoose.Schema({
      courseId: String,
      userId: String,
      topic: String,
      content: String,
      replies: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      isPinned: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    });
    const Discussion = mongoose.models.Discussion || mongoose.model('Discussion', DiscussionSchema);
    await Discussion.deleteMany({});
    const discussionData = courses.slice(0, 5).flatMap((course, idx) => [
      {
        courseId: course._id.toString(),
        userId: users[idx % users.length]._id.toString(),
        topic: `Question about ${course.title} - Lesson 1`,
        content: 'Can someone help me understand this concept better?',
        replies: Math.floor(Math.random() * 15),
        views: Math.floor(Math.random() * 100),
        isPinned: idx === 0,
      },
      {
        courseId: course._id.toString(),
        userId: users[(idx + 1) % users.length]._id.toString(),
        topic: `Study Group for ${course.title}`,
        content: 'Anyone interested in forming a study group?',
        replies: Math.floor(Math.random() * 10),
        views: Math.floor(Math.random() * 80),
      },
    ]);
    await Discussion.insertMany(discussionData);
    console.log(`✅ Created ${discussionData.length} discussions`);

    // Assessments Collection
    console.log('\n📋 Seeding Assessments...');
    const AssessmentSchema = new mongoose.Schema({
      courseId: String,
      lessonId: String,
      title: String,
      type: { type: String, enum: ['quiz', 'assignment', 'exam'], default: 'quiz' },
      questions: { type: Number, default: 10 },
      duration: Number,
      passingScore: { type: Number, default: 70 },
      createdAt: { type: Date, default: Date.now },
    });
    const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);
    await Assessment.deleteMany({});
    const assessmentData = courses.slice(0, 5).flatMap(course => [
      {
        courseId: course._id.toString(),
        lessonId: 'lesson_' + course._id.toString().slice(-8),
        title: `${course.title} - Quiz 1`,
        type: 'quiz' as const,
        questions: 10,
        duration: 30,
        passingScore: 70,
      },
      {
        courseId: course._id.toString(),
        lessonId: 'lesson_' + course._id.toString().slice(-8),
        title: `${course.title} - Final Exam`,
        type: 'exam' as const,
        questions: 50,
        duration: 120,
        passingScore: 60,
      },
    ]);
    await Assessment.insertMany(assessmentData);
    console.log(`✅ Created ${assessmentData.length} assessments`);

    // Quizzes Collection
    console.log('\n📝 Seeding Quizzes...');
    const QuizSchema = new mongoose.Schema({
      userId: String,
      assessmentId: String,
      courseId: String,
      score: Number,
      totalQuestions: Number,
      correctAnswers: Number,
      timeSpent: Number,
      passed: Boolean,
      completedAt: { type: Date, default: Date.now },
    });
    const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);
    await Quiz.deleteMany({});
    const assessments = await Assessment.find().limit(10);
    const quizData = users.slice(0, 5).flatMap(user =>
      assessments.slice(0, 2).map(assessment => {
        const correctAnswers = Math.floor(Math.random() * 10) + 5;
        const totalQuestions = assessment.questions;
        const score = Math.floor((correctAnswers / totalQuestions) * 100);
        return {
          userId: user._id.toString(),
          assessmentId: assessment._id.toString(),
          courseId: assessment.courseId,
          score,
          totalQuestions,
          correctAnswers,
          timeSpent: Math.floor(Math.random() * 1800) + 600,
          passed: score >= assessment.passingScore,
        };
      })
    );
    await Quiz.insertMany(quizData);
    console.log(`✅ Created ${quizData.length} quiz results`);

    // Verify all collections
    console.log('\n✅ Verifying all collections in database...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📚 Collections in my_elearning database:');
    collections.forEach((col, idx) => {
      console.log(`  ${idx + 1}. ${col.name}`);
    });

    console.log('\n🎉 All collections seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Total Collections: ${collections.length}`);
    console.log(`  - Users: ${users.length}`);
    console.log(`  - Courses: ${courses.length}`);
    console.log(`  - Progress: ${await Progress.countDocuments()}`);
    console.log(`  - Notifications: ${await Notification.countDocuments()}`);
    console.log(`  - Subscriptions: ${await Subscription.countDocuments()}`);
    console.log(`  - Projects: ${await Project.countDocuments()}`);
    console.log(`  - Messages: ${await Message.countDocuments()}`);
    console.log(`  - UserAchievements: ${await UserAchievement.countDocuments()}`);
    console.log(`  - Posts: ${await Post.countDocuments()}`);
    console.log(`  - Discussions: ${await Discussion.countDocuments()}`);
    console.log(`  - Assessments: ${await Assessment.countDocuments()}`);
    console.log(`  - Quizzes: ${await Quiz.countDocuments()}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding collections:', error);
    process.exit(1);
  }
}

seedAllCollections();

