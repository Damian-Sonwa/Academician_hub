/**
 * Weekly Content Routes
 * Handles weekly course content and sequential learning progression
 */

import express, { Request, Response } from 'express';
import Course from '../models/Course';
import Lesson from '../models/Lesson';
import WeeklyProgress from '../models/WeeklyProgress';
import { authMiddleware } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

const router = express.Router();

/**
 * Normalize level names to match WeeklyProgress enum
 * Maps: Basic→beginner, Secondary→secondary, Advanced→advanced, Beginner→beginner, Intermediate→intermediate
 */
function normalizeLevel(level: string): string {
  const levelLower = level.toLowerCase();
  if (levelLower === 'basic') return 'beginner';
  if (levelLower === 'secondary') return 'secondary';
  if (levelLower === 'advanced') return 'advanced';
  if (levelLower === 'beginner') return 'beginner';
  if (levelLower === 'intermediate') return 'intermediate';
  return levelLower; // fallback
}

/**
 * @route   GET /api/weekly/:courseId/:level/weeks
 * @desc    Get all weeks for a course level
 * @access  Private
 */
router.get('/:courseId/:level/weeks', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { courseId, level } = req.params;
    const normalizedLevel = normalizeLevel(level);
    const userId = req.userId;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    // Get all lessons (weeks) for this course, ordered by week number
    const lessons = await Lesson.find({ courseId: courseId.toString() })
      .sort({ order: 1 });

    // Get user's weekly progress
    const progress = await WeeklyProgress.find({
      userId: userId,
      courseId: courseId.toString(),
      level: normalizedLevel,
    });

    // Create progress map
    const progressMap = new Map();
    progress.forEach(p => {
      progressMap.set(p.week, p);
    });

    // Check if user is admin
    const User = (await import('../models/User')).default;
    const userDoc = await User.findById(userId);
    const isAdmin = userDoc?.role === 'admin';

    // Format response with progress status
    const weeks = lessons.map((lesson: any, index) => {
      const weekNumber = lesson.week || (index + 1);
      const weekProgress = progressMap.get(weekNumber);
      
      // Determine status
      // Admins have access to all weeks
      let status = 'locked';
      if (isAdmin) {
        status = weekProgress?.status || 'unlocked';
      } else if (weekNumber === 1) {
        status = weekProgress?.status === 'completed' ? 'completed' : 'unlocked';
      } else {
        // Check if previous week is completed
        const prevWeekProgress = progressMap.get(weekNumber - 1);
        if (prevWeekProgress?.status === 'completed') {
          status = weekProgress?.status || 'unlocked';
        } else if (weekProgress?.status) {
          status = weekProgress.status;
        }
      }

      return {
        week: weekNumber,
        topic: lesson.title,
        status: status,
        assignmentsCompleted: weekProgress?.assignmentsCompleted || 0,
        totalAssignments: weekProgress?.totalAssignments || 0,
        quizzesCompleted: weekProgress?.quizzesCompleted || 0,
        totalQuizzes: weekProgress?.totalQuizzes || 0,
        completedAt: weekProgress?.completedAt || null,
      };
    });

    res.json({
      success: true,
      data: {
        course: {
          _id: course._id,
          title: course.title,
          level: course.level,
        },
        weeks: weeks,
      },
    });
  } catch (error: any) {
    console.error('Error fetching weeks:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/weekly/:courseId/:level/week/:weekNumber
 * @desc    Get specific week content
 * @access  Private
 */
router.get('/:courseId/:level/week/:weekNumber', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { courseId, level, weekNumber } = req.params;
    const normalizedLevel = normalizeLevel(level);
    const userId = req.userId;
    const week = parseInt(weekNumber);

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    // Get lesson for this week
    const lesson = await Lesson.findOne({
      courseId: courseId.toString(),
      week: week,
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Week not found',
      });
    }

    // Check if user can access this week (sequential learning)
    // Admins bypass sequential learning restrictions
    const User = (await import('../models/User')).default;
    const userDoc = await User.findById(userId);
    const isAdmin = userDoc?.role === 'admin';

    if (!isAdmin && week > 1) {
      const prevWeekProgress = await WeeklyProgress.findOne({
        userId: userId,
        courseId: courseId.toString(),
        level: normalizedLevel,
        week: week - 1,
      });

      if (!prevWeekProgress || prevWeekProgress.status !== 'completed') {
        return res.status(403).json({
          success: false,
          error: 'Previous week must be completed before accessing this week',
          requiredWeek: week - 1,
        });
      }
    }

    // Get or create weekly progress
    let weekProgress = await WeeklyProgress.findOne({
      userId: userId,
      courseId: courseId.toString(),
      level: normalizedLevel,
      week: week,
    });

    if (!weekProgress) {
      // Try to load from JSON to get assignment/quiz counts
      const courseName = course.title.toLowerCase().split(' - ')[0];
      const weekFile = path.join(
        process.cwd(),
        'seed',
        'courses',
        courseName,
        level,
        `week_${week}.json`
      );

      let totalAssignments = 0;
      let totalQuizzes = 0;

      if (fs.existsSync(weekFile)) {
        const weeklyContent = JSON.parse(fs.readFileSync(weekFile, 'utf-8'));
        totalAssignments = weeklyContent.assignments?.length || 0;
        totalQuizzes = weeklyContent.quizzes?.length || 0;
      }

      weekProgress = await WeeklyProgress.create({
        userId: userId,
        courseId: courseId.toString(),
        level: normalizedLevel,
        week: week,
        topic: lesson.title,
        status: 'unlocked',
        totalAssignments: totalAssignments,
        totalQuizzes: totalQuizzes,
        unlockedAt: new Date(),
      });
    }

    // Load full weekly content from JSON if available
    const courseName = course.title.toLowerCase().split(' - ')[0];
    const weekFile = path.join(
      process.cwd(),
      'seed',
      'courses',
      courseName,
      level,
      `week_${week}.json`
    );

    let weeklyContent = null;
    if (fs.existsSync(weekFile)) {
      weeklyContent = JSON.parse(fs.readFileSync(weekFile, 'utf-8'));
    }

    res.json({
      success: true,
      data: {
        week: week,
        topic: lesson.title,
        summary: weeklyContent?.summary || lesson.content,
        why_it_matters: weeklyContent?.why_it_matters || lesson.description,
        materials: weeklyContent?.materials || {
          videos: lesson.videoUrl ? [{ title: lesson.title, url: lesson.videoUrl }] : [],
          textbooks: [],
          labs: [],
        },
        assignments: weeklyContent?.assignments || lesson.assignments || [],
        quizzes: weeklyContent?.quizzes || (lesson.quiz ? lesson.quiz.questions.map((q: any) => ({
          question: q.question,
          options: q.options,
          answer: q.correctAnswer,
          type: q.type || 'multiple-choice',
          explanation: q.explanation,
        })) : []),
        progress: {
          status: weekProgress.status,
          assignmentsCompleted: weekProgress.assignmentsCompleted,
          totalAssignments: weekProgress.totalAssignments,
          quizzesCompleted: weekProgress.quizzesCompleted,
          totalQuizzes: weekProgress.totalQuizzes,
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching week content:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/weekly/:courseId/:level/week/:weekNumber/complete-assignment
 * @desc    Mark assignment as completed
 * @access  Private
 */
router.post('/:courseId/:level/week/:weekNumber/complete-assignment', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { courseId, level, weekNumber } = req.params;
    const normalizedLevel = normalizeLevel(level);
    const { assignmentIndex } = req.body;
    const userId = req.userId;
    const week = parseInt(weekNumber);

    let weekProgress = await WeeklyProgress.findOne({
      userId: userId,
      courseId: courseId.toString(),
      level: normalizedLevel,
      week: week,
    });

    if (!weekProgress) {
      return res.status(404).json({
        success: false,
        error: 'Week progress not found',
      });
    }

    // Check if assignment already submitted
    const existingSubmission = weekProgress.assignmentSubmissions.find(
      (s: any) => s.assignmentIndex === assignmentIndex
    );

    if (!existingSubmission) {
      weekProgress.assignmentSubmissions.push({
        assignmentIndex: assignmentIndex,
        submittedAt: new Date(),
        status: 'submitted',
      });
      weekProgress.assignmentsCompleted += 1;
    }

    // Check if all assignments and quizzes are completed
    if (
      weekProgress.assignmentsCompleted >= weekProgress.totalAssignments &&
      weekProgress.quizzesCompleted >= weekProgress.totalQuizzes
    ) {
      weekProgress.status = 'completed';
      weekProgress.completedAt = new Date();
    } else if (weekProgress.status === 'locked') {
      weekProgress.status = 'in-progress';
      if (!weekProgress.startedAt) {
        weekProgress.startedAt = new Date();
      }
    }

    await weekProgress.save();

    res.json({
      success: true,
      data: {
        assignmentsCompleted: weekProgress.assignmentsCompleted,
        totalAssignments: weekProgress.totalAssignments,
        status: weekProgress.status,
        weekCompleted: weekProgress.status === 'completed',
      },
    });
  } catch (error: any) {
    console.error('Error completing assignment:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/weekly/:courseId/:level/week/:weekNumber/complete-quiz
 * @desc    Submit quiz and update progress
 * @access  Private
 */
router.post('/:courseId/:level/week/:weekNumber/complete-quiz', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { courseId, level, weekNumber } = req.params;
    const normalizedLevel = normalizeLevel(level);
    const { quizIndex, answers, score } = req.body;
    const userId = req.userId;
    const week = parseInt(weekNumber);

    let weekProgress = await WeeklyProgress.findOne({
      userId: userId,
      courseId: courseId.toString(),
      level: normalizedLevel,
      week: week,
    });

    if (!weekProgress) {
      return res.status(404).json({
        success: false,
        error: 'Week progress not found',
      });
    }

    // Check if quiz already completed
    const existingScore = weekProgress.quizScores.find(
      (s: any) => s.quizIndex === quizIndex
    );

    if (!existingScore) {
      weekProgress.quizScores.push({
        quizIndex: quizIndex,
        score: score,
        completedAt: new Date(),
      });
      weekProgress.quizzesCompleted += 1;
    }

    // Check if all assignments and quizzes are completed
    if (
      weekProgress.assignmentsCompleted >= weekProgress.totalAssignments &&
      weekProgress.quizzesCompleted >= weekProgress.totalQuizzes
    ) {
      weekProgress.status = 'completed';
      weekProgress.completedAt = new Date();
    } else if (weekProgress.status === 'locked') {
      weekProgress.status = 'in-progress';
      if (!weekProgress.startedAt) {
        weekProgress.startedAt = new Date();
      }
    }

    await weekProgress.save();

    res.json({
      success: true,
      data: {
        quizzesCompleted: weekProgress.quizzesCompleted,
        totalQuizzes: weekProgress.totalQuizzes,
        score: score,
        status: weekProgress.status,
        weekCompleted: weekProgress.status === 'completed',
      },
    });
  } catch (error: any) {
    console.error('Error completing quiz:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/weekly/progress/:courseId/:level
 * @desc    Get user's weekly progress for a course
 * @access  Private
 */
router.get('/progress/:courseId/:level', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { courseId, level } = req.params;
    const normalizedLevel = normalizeLevel(level);
    const userId = req.userId;

    const progress = await WeeklyProgress.find({
      userId: userId,
      courseId: courseId.toString(),
      level: normalizedLevel,
    }).sort({ week: 1 });

    res.json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    console.error('Error fetching progress:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

