import express, { Request, Response } from 'express';
import UserAchievement from '../models/UserAchievement';
import Achievement from '../models/Achievement';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/achievements
 * @desc    Get all available achievements
 * @access  Private
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const achievements = await Achievement.find();
    const userAchievements = await UserAchievement.find({ userId: req.userId });
    
    const userAchievementIds = new Set(
      userAchievements.map(ua => ua.achievementId)
    );

    const achievementsWithStatus = achievements.map(achievement => ({
      ...achievement.toObject(),
      unlocked: userAchievementIds.has(achievement._id.toString()),
      unlockedAt: userAchievements.find(
        ua => ua.achievementId === achievement._id.toString()
      )?.unlockedAt,
    }));

    res.json({
      success: true,
      data: achievementsWithStatus,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/achievements/user
 * @desc    Get user's unlocked achievements
 * @access  Private
 */
router.get('/user', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userAchievements = await UserAchievement.find({ userId: req.userId })
      .sort({ unlockedAt: -1 });

    // Populate achievement details
    const achievementIds = userAchievements.map(ua => ua.achievementId);
    const achievements = await Achievement.find({ _id: { $in: achievementIds } });

    const achievementsMap = new Map(
      achievements.map(a => [a._id.toString(), a])
    );

    const enrichedAchievements = userAchievements.map(ua => ({
      ...ua.toObject(),
      achievement: achievementsMap.get(ua.achievementId),
    }));

    res.json({
      success: true,
      data: enrichedAchievements,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/achievements/unlock
 * @desc    Unlock an achievement for user
 * @access  Private
 */
router.post('/unlock', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { achievementId } = req.body;

    // Check if already unlocked
    const existing = await UserAchievement.findOne({
      userId: req.userId,
      achievementId,
    });

    if (existing) {
      res.status(400).json({
        success: false,
        error: 'Achievement already unlocked',
      });
      return;
    }

    // Get achievement details
    const achievement = await Achievement.findById(achievementId);
    if (!achievement) {
      res.status(404).json({
        success: false,
        error: 'Achievement not found',
      });
      return;
    }

    // Create user achievement
    const userAchievement = await UserAchievement.create({
      userId: req.userId,
      achievementId,
      unlockedAt: new Date(),
    });

    // Update user badges
    const user = await User.findById(req.userId);
    if (user && achievement.badge) {
      if (!user.badges.includes(achievement.badge)) {
        user.badges.push(achievement.badge);
        await user.save();
      }
    }

    // Emit achievement unlock via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('achievement:unlocked', {
        userId: req.userId,
        achievement: {
          name: achievement.name,
          description: achievement.description,
          badge: achievement.badge,
          icon: achievement.icon,
        },
      });
    }

    res.json({
      success: true,
      message: `Achievement unlocked: ${achievement.name}!`,
      data: {
        userAchievement,
        achievement,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/achievements/leaderboard
 * @desc    Get achievement leaderboard
 * @access  Private
 */
router.get('/leaderboard', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Aggregate users by achievement count
    const leaderboard = await UserAchievement.aggregate([
      {
        $group: {
          _id: '$userId',
          achievementCount: { $sum: 1 },
        },
      },
      {
        $sort: { achievementCount: -1 },
      },
      {
        $limit: 50,
      },
    ]);

    // Populate user details
    const userIds = leaderboard.map(entry => entry._id);
    const users = await User.find({ _id: { $in: userIds } });
    
    const usersMap = new Map(users.map(u => [u._id.toString(), u]));

    const enrichedLeaderboard = leaderboard.map((entry, index) => {
      const user = usersMap.get(entry._id);
      return {
        rank: index + 1,
        userId: entry._id,
        name: user?.name || 'Unknown',
        avatar: user?.avatar,
        level: user?.level || 1,
        xp: user?.xp || 0,
        achievementCount: entry.achievementCount,
      };
    });

    res.json({
      success: true,
      data: enrichedLeaderboard,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

