import express, { Request, Response } from 'express';
import Course from '../models/Course';
import Lesson from '../models/Lesson';
import Progress from '../models/Progress';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get specific course by subject and level
router.get('/courses/:subject/:level', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { subject, level } = req.params;
    
    // Find course matching subject (category) and level
    const course = await Course.findOne({
      $or: [
        { title: new RegExp(subject, 'i') },
        { category: new RegExp(subject, 'i') }
      ],
      level: new RegExp(`^${level}$`, 'i')
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found for this subject and level combination',
      });
    }

    // Get all lessons for this course
    const lessons = await Lesson.find({ courseId: course._id.toString() })
      .sort({ order: 1 });

    // Get user's progress for this course (if exists)
    let progress = null;
    if (req.userId) {
      progress = await Progress.findOne({
        userId: req.userId,
        courseId: course._id.toString(),
      });
    }

    // Calculate completion stats
    const totalLessons = lessons.length;
    const completedLessons = progress?.completedLessons?.length || 0;
    const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Check if user is enrolled
    const isEnrolled = !!progress;

    // Create assessments data (quiz + assignments)
    const assessments = {
      quiz: {
        id: `${course._id}_quiz`,
        title: `${course.title} - Quiz`,
        type: 'quiz',
        duration: '30 minutes',
        questions: 20,
        available: isEnrolled,
      },
      assignment: {
        id: `${course._id}_assignment`,
        title: `${course.title} - Assignment`,
        type: 'assignment',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        available: isEnrolled && completedLessons >= Math.floor(totalLessons * 0.5), // Available after 50% completion
      },
    };

    res.json({
      success: true,
      data: {
        course: {
          _id: course._id,
          title: course.title,
          description: course.description,
          category: course.category,
          level: course.level,
          instructor: course.instructor,
          duration: course.duration,
          enrolled: course.enrolled,
          isPremium: course.isPremium,
          imageUrl: course.imageUrl,
          textbookTitle: course.textbookTitle,
          textbookUrl: course.textbookUrl,
          textbookLicense: course.textbookLicense,
          textbookAttribution: course.textbookAttribution,
          assessmentPoints: course.assessmentPoints,
        },
        lessons: lessons.map(lesson => ({
          _id: lesson._id,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          duration: lesson.duration,
          order: lesson.order,
          isCompleted: progress?.completedLessons?.includes(lesson._id.toString()) || false,
          videoUrl: lesson.videoUrl,
          imageUrl: lesson.imageUrl,
          images: lesson.images,
          resources: lesson.resources,
          assignments: lesson.assignments,
          quiz: lesson.quiz,
        })),
        progress: {
          isEnrolled,
          completedLessons,
          totalLessons,
          completionPercentage,
          currentLesson: progress?.currentLesson || (lessons[0]?._id?.toString()),
          xpEarned: progress?.xpEarned || 0,
          lastAccessed: progress?.lastAccessed,
        },
        assessments,
        learningObjectives: [
          `Master ${course.title} fundamentals and core concepts`,
          `Apply practical skills through hands-on exercises`,
          `Complete assessments to demonstrate understanding`,
          `Earn XP and badges for course completion`,
        ],
      },
    });
  } catch (error: any) {
    console.error('Error fetching course by subject/level:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all available subjects (categories)
router.get('/list/subjects', authMiddleware, async (req: Request, res: Response) => {
  try {
    const subjects = await Course.distinct('category');
    
    res.json({
      success: true,
      data: subjects.map(subject => ({
        value: subject,
        label: subject.charAt(0).toUpperCase() + subject.slice(1),
      })),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all available levels
router.get('/list/levels', authMiddleware, async (req: Request, res: Response) => {
  try {
    const levels = await Course.distinct('level');
    
    res.json({
      success: true,
      data: levels.map(level => ({
        value: level,
        label: level,
      })),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Enroll in a course
// Note: Admins can enroll in any course including premium courses without subscription restrictions
router.post('/enroll/:subject/:level', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { subject, level } = req.params;
    const isAdmin = req.userRole === 'admin';
    
    const course = await Course.findOne({
      $or: [
        { title: new RegExp(subject, 'i') },
        { category: new RegExp(subject, 'i') }
      ],
      level: new RegExp(`^${level}$`, 'i')
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    // Admins bypass premium restrictions - they can enroll in any course
    // For non-admins, premium course access is handled on the frontend via subscription checks
    if (!isAdmin && course.isPremium) {
      // This check is mainly for API consistency - frontend should handle subscription checks
      // But we allow it here since admins can always enroll
    }

    // Check if already enrolled
    const existingProgress = await Progress.findOne({
      userId: req.userId,
      courseId: course._id.toString(),
    });

    if (existingProgress) {
      return res.status(400).json({
        success: false,
        error: 'Already enrolled in this course',
      });
    }

    // Get first lesson
    const firstLesson = await Lesson.findOne({ courseId: course._id.toString() })
      .sort({ order: 1 });

    // Create progress entry
    const progress = new Progress({
      userId: req.userId,
      courseId: course._id.toString(),
      completedLessons: [],
      currentLesson: firstLesson?._id?.toString(),
      progress: 0,
      xpEarned: 0,
      timeSpent: 0,
      lastAccessed: new Date(),
    });

    await progress.save();

    // Update course enrollment count
    await Course.findByIdAndUpdate(course._id, {
      $inc: { enrolled: 1 },
    });

    res.json({
      success: true,
      message: `Successfully enrolled in ${course.title}!`,
      data: progress,
    });
  } catch (error: any) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

