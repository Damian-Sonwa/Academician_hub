import express, { Request, Response } from 'express';
import Course from '../models/Course';
import Lesson from '../models/Lesson';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/courses
 * @desc    Get all courses with optional filtering
 * @access  Private
 * @query   category - Filter by category (optional)
 * @query   level - Filter by level (optional)
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { category, level } = req.query;
    
    // Build filter query
    const filter: any = {};
    if (category && category !== 'all') {
      filter.category = new RegExp(category as string, 'i');
    }
    if (level && level !== 'all') {
      filter.level = new RegExp(`^${level}$`, 'i');
    }
    
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: courses,
      count: courses.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/courses/:id
 * @desc    Get single course by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404).json({
        success: false,
        error: 'Course not found',
      });
      return;
    }

    // Get lessons for this course
    const lessons = await Lesson.find({ courseId: course._id.toString() })
      .sort({ order: 1 });

    // Get user's progress for this course (if exists)
    const Progress = (await import('../models/Progress')).default;
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

    // Create assessments data
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
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        available: isEnrolled && completedLessons >= Math.floor(totalLessons * 0.5),
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
        },
        lessons: lessons.map((lesson: any) => ({
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
    console.error('Error fetching course by ID:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/courses
 * @desc    Create a new course (Admin only)
 * @access  Private/Admin
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    // TODO: Add admin check middleware
    const course = await Course.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/courses/:id
 * @desc    Update course
 * @access  Private/Admin
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      res.status(404).json({
        success: false,
        error: 'Course not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete course
 * @access  Private/Admin
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      res.status(404).json({
        success: false,
        error: 'Course not found',
      });
      return;
    }

    // Also delete associated lessons
    await Lesson.deleteMany({ courseId: course._id.toString() });

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

