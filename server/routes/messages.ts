import express, { Request, Response } from 'express';
import Message from '../models/Message';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/messages/:roomId
 * @desc    Get messages for a room
 * @access  Private
 */
router.get('/:roomId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const messages = await Message.find({ roomId })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: messages.reverse(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/messages
 * @desc    Create a new message
 * @access  Private
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const message = await Message.create({
      ...req.body,
      userId: req.userId,
    });

    // Emit message via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(message.roomId).emit('message:received', message);
    }

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/messages/:id
 * @desc    Delete a message
 * @access  Private
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const message = await Message.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!message) {
      res.status(404).json({
        success: false,
        error: 'Message not found or unauthorized',
      });
      return;
    }

    // Emit message deletion via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(message.roomId).emit('message:deleted', { messageId: message._id });
    }

    res.json({
      success: true,
      message: 'Message deleted',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

