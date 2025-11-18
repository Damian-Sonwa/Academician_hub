import express, { Request, Response } from 'express';
import Progress from '../models/Progress';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/progress
 * @desc    Get all progress for current user
 * @access  Private
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const progress = await Progress.find({ userId: req.userId })
      .sort({ lastAccessed: -1 });
    
    res.json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/progress/:courseId
 * @desc    Get progress for specific course
 * @access  Private
 */
router.get('/:courseId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const progress = await Progress.findOne({
      userId: req.userId,
      courseId: req.params.courseId,
    });

    if (!progress) {
      res.status(404).json({
        success: false,
        error: 'Progress not found for this course',
      });
      return;
    }

    res.json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/progress
 * @desc    Create or update progress
 * @access  Private
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { courseId, lessonId, completed, timeSpent, quizScore, quizPassed } = req.body;

    // Import Lesson model to check if lesson has quiz
    const Lesson = (await import('../models/Lesson')).default;
    const lesson = lessonId ? await Lesson.findById(lessonId) : null;
    
    // Check if lesson has a quiz and if it was passed
    const hasQuiz = lesson && lesson.quiz && lesson.quiz.questions && lesson.quiz.questions.length > 0;
    const minPassingScore = 70; // 70% required to pass
    
    // If lesson has quiz and user is trying to complete it, verify quiz was passed
    if (completed && hasQuiz && quizPassed !== true) {
      // Check if user has a passing quiz score for this lesson
      let progress = await Progress.findOne({
        userId: req.userId,
        courseId,
      });
      
      const lessonQuizScore = progress?.quizScores?.find((qs: any) => 
        qs.lessonId === lessonId && qs.score >= minPassingScore
      );
      
      if (!lessonQuizScore) {
        return res.status(400).json({
          success: false,
          error: 'You must pass the quiz (70% or higher) before completing this lesson. Please complete the quiz first.',
          requiresQuiz: true,
          quizRequired: true,
        });
      }
    }

    let progress = await Progress.findOne({
      userId: req.userId,
      courseId,
    });

    if (!progress) {
      // Create new progress
      progress = await Progress.create({
        userId: req.userId,
        courseId,
        completedLessons: completed ? [lessonId] : [],
        currentLesson: lessonId,
        progress: 0,
        xpEarned: 0,
        timeSpent: timeSpent || 0,
        lastAccessed: new Date(),
      });
    } else {
      // Update existing progress
      if (completed && lessonId && !progress.completedLessons.includes(lessonId)) {
        // Double-check quiz requirement before allowing completion
        if (hasQuiz) {
          const lessonQuizScore = progress.quizScores?.find((qs: any) => 
            qs.lessonId === lessonId && qs.score >= minPassingScore
          );
          
          if (!lessonQuizScore && quizPassed !== true) {
            return res.status(400).json({
              success: false,
              error: 'You must pass the quiz (70% or higher) before completing this lesson.',
              requiresQuiz: true,
              quizRequired: true,
            });
          }
        }
        
        progress.completedLessons.push(lessonId);
        
        // Award XP for completion
        const xpReward = 50;
        progress.xpEarned += xpReward;
        
        // Update user XP and level
        const user = await User.findById(req.userId);
        if (user) {
          user.xp += xpReward;
          
          // Level up logic (100 XP per level)
          const newLevel = Math.floor(user.xp / 100) + 1;
          if (newLevel > user.level) {
            user.level = newLevel;
            
            // Emit level up event via Socket.io
            const io = req.app.get('io');
            if (io) {
              io.emit('user:levelup', {
                userId: user._id,
                name: user.name,
                level: newLevel,
              });
            }
          }
          
          await user.save();
        }
      }

      if (lessonId) {
        progress.currentLesson = lessonId;
      }

      if (timeSpent) {
        progress.timeSpent += timeSpent;
      }

      if (quizScore !== undefined) {
        // Check if quiz score already exists for this lesson
        const existingScoreIndex = progress.quizScores?.findIndex((qs: any) => 
          qs.lessonId === lessonId
        );
        
        if (existingScoreIndex !== undefined && existingScoreIndex >= 0) {
          // Update existing score
          progress.quizScores[existingScoreIndex].score = quizScore;
          progress.quizScores[existingScoreIndex].attemptedAt = new Date();
        } else {
          // Add new score
          if (!progress.quizScores) {
            progress.quizScores = [];
          }
          progress.quizScores.push({
            lessonId,
            score: quizScore,
            attemptedAt: new Date(),
          });
        }
      }

      progress.lastAccessed = new Date();
      await progress.save();
    }

    // Emit progress update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('progress:updated', {
        userId: req.userId,
        courseId,
        progress: progress.progress,
      });
    }

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: progress,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/progress/stats/overview
 * @desc    Get overall progress statistics for user
 * @access  Private
 */
router.get('/stats/overview', authMiddleware, async (req: Request, res: Response) => {
  try {
    const allProgress = await Progress.find({ userId: req.userId });
    const user = await User.findById(req.userId);

    const stats = {
      totalCourses: allProgress.length,
      completedLessons: allProgress.reduce((sum, p) => sum + p.completedLessons.length, 0),
      totalXP: user?.xp || 0,
      level: user?.level || 1,
      totalTimeSpent: allProgress.reduce((sum, p) => sum + p.timeSpent, 0),
      averageProgress: allProgress.length > 0 
        ? allProgress.reduce((sum, p) => sum + p.progress, 0) / allProgress.length 
        : 0,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

