import express, { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import AssignmentSubmission from '../models/AssignmentSubmission';
import { authMiddleware } from '../middleware/auth';
import { createAssignmentForLesson } from '../utils/assignmentGenerator';

const router = express.Router();

/**
 * @route   GET /api/assignments/lesson/:lessonId
 * @desc    Get assignment for a specific lesson
 * @access  Private
 */
router.get('/lesson/:lessonId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user?.id;

    const assignment = await Assignment.findOne({ lessonId });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found for this lesson',
      });
    }

    // Check if user has already submitted
    let submission = null;
    if (userId) {
      submission = await AssignmentSubmission.findOne({
        userId,
        assignmentId: assignment._id,
      });
    }

    res.json({
      success: true,
      data: {
        assignment,
        submission: submission || null,
        hasSubmitted: !!submission,
      },
    });
  } catch (error: any) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch assignment',
    });
  }
});

/**
 * @route   POST /api/assignments/:assignmentId/submit
 * @desc    Submit assignment answers
 * @access  Private
 */
router.post('/:assignmentId/submit', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user?.id;
    const { answers, timeSpent } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
    }

    // Check if already submitted
    const existing = await AssignmentSubmission.findOne({
      userId,
      assignmentId: assignment._id,
    });

    if (existing) {
      return res.json({
        success: true,
        data: existing,
        message: 'You have already submitted this assignment',
      });
    }

    // Grade the answers
    let totalScore = 0;
    let totalPoints = assignment.totalPoints;
    const gradedAnswers = [];

    for (const answer of answers) {
      const question = assignment.questions.find(
        (q: any) => q._id?.toString() === answer.questionId
      );

      if (!question) continue;

      const isCorrect = checkAnswer(answer.answer, question.correctAnswer);
      const pointsEarned = isCorrect ? question.points : 0;
      totalScore += pointsEarned;

      gradedAnswers.push({
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect,
        pointsEarned,
      });
    }

    const percentageScore = (totalScore / totalPoints) * 100;
    const isPassed = percentageScore >= assignment.passingScore;

    // Create submission
    const submission = new AssignmentSubmission({
      userId,
      assignmentId: assignment._id,
      lessonId: assignment.lessonId,
      courseId: assignment.courseId,
      answers: gradedAnswers,
      totalScore,
      totalPoints,
      percentageScore,
      isPassed,
      timeSpent: timeSpent || 0,
    });

    await submission.save();

    res.json({
      success: true,
      data: submission,
      message: isPassed
        ? 'Congratulations! You passed the assignment!'
        : `You scored ${percentageScore.toFixed(1)}%. You need ${assignment.passingScore}% to pass.`,
    });
  } catch (error: any) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit assignment',
    });
  }
});

/**
 * @route   GET /api/assignments/:assignmentId/submission
 * @desc    Get user's submission for an assignment
 * @access  Private
 */
router.get('/:assignmentId/submission', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user?.id;

    const submission = await AssignmentSubmission.findOne({
      userId,
      assignmentId,
    });

    if (!submission) {
      return res.json({
        success: true,
        data: null,
      });
    }

    res.json({
      success: true,
      data: submission,
    });
  } catch (error: any) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch submission',
    });
  }
});

/**
 * @route   POST /api/assignments/generate
 * @desc    Generate assignments for all lessons
 * @access  Private (Admin only)
 */
router.post('/generate', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Import here to avoid circular dependency
    const { createAssignmentsForAllLessons } = await import('../utils/assignmentGenerator');
    
    await createAssignmentsForAllLessons();
    
    res.json({
      success: true,
      message: 'All assignments generated successfully',
    });
  } catch (error: any) {
    console.error('Error generating assignments:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate assignments',
    });
  }
});

// Helper function to check if answer is correct
function checkAnswer(userAnswer: any, correctAnswer: string | string[]): boolean {
  if (Array.isArray(correctAnswer)) {
    // Check if user answer is in the array (case-insensitive for short answers)
    return correctAnswer.some((ans) =>
      ans.toLowerCase().trim() === userAnswer.toLowerCase().trim()
    );
  }
  return userAnswer === correctAnswer;
}

export default router;

