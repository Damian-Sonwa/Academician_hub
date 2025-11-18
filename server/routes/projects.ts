import express, { Request, Response } from 'express';
import Project from '../models/Project';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/projects
 * @desc    Get all projects for current user
 * @access  Private
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
      });
      return;
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const project = await Project.create({
      ...req.body,
      userId: req.userId,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/projects/:id/submit
 * @desc    Submit project for review
 * @access  Private
 */
router.post('/:id/submit', authMiddleware, async (req: Request, res: Response) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { 
        status: 'submitted',
        submittedAt: new Date(),
      },
      { new: true }
    );

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Project submitted for review!',
      data: project,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/projects/showcase/all
 * @desc    Get all approved projects for showcase
 * @access  Public
 */
router.get('/showcase/all', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ status: 'approved' })
      .sort({ gradedAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

