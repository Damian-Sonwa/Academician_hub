import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import languageGreetingsData from '../data/languageGreetings';

const router = express.Router();

/**
 * @route   GET /api/greetings/:language
 * @desc    Get comprehensive greetings data for a specific language
 * @access  Private
 */
router.get('/:language', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { language } = req.params;
    const languageLower = language.toLowerCase();

    // Find greeting data for the specified language
    const greetingsData = Object.values(languageGreetingsData).find(
      (data) => data.language.toLowerCase().includes(languageLower)
    );

    if (!greetingsData) {
      res.status(404).json({
        success: false,
        error: `Greetings data not found for language: ${language}`,
      });
      return;
    }

    res.json({
      success: true,
      data: greetingsData,
    });
  } catch (error: any) {
    console.error('Error fetching greetings data:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch greetings data',
    });
  }
});

/**
 * @route   GET /api/greetings
 * @desc    Get all available languages with greetings data
 * @access  Private
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const languages = Object.values(languageGreetingsData).map((data) => ({
      language: data.language,
      overview: data.overview.substring(0, 150) + '...',
    }));

    res.json({
      success: true,
      data: languages,
      count: languages.length,
    });
  } catch (error: any) {
    console.error('Error fetching greetings list:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch greetings list',
    });
  }
});

export default router;

