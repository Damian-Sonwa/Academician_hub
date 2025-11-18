import express, { Request, Response } from 'express';
import Alphabet from '../models/Alphabet';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/alphabets/:language
 * @desc    Get alphabet and numbers data for a specific language
 * @access  Private
 */
router.get('/:language', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { language } = req.params;
    
    // Find alphabet data for the specified language (case-insensitive)
    const alphabetData = await Alphabet.findOne({
      language: new RegExp(`^${language}$`, 'i')
    });

    if (!alphabetData) {
      res.status(404).json({
        success: false,
        error: `Alphabet data not found for language: ${language}`,
      });
      return;
    }

    res.json({
      success: true,
      data: {
        language: alphabetData.language,
        letters: alphabetData.letters,
        numbers: alphabetData.numbers,
        description: alphabetData.description,
        specialNotes: alphabetData.specialNotes,
      },
    });
  } catch (error: any) {
    console.error('Error fetching alphabet data:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch alphabet data',
    });
  }
});

/**
 * @route   GET /api/alphabets
 * @desc    Get all available languages with alphabet data
 * @access  Private
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const alphabets = await Alphabet.find({}, 'language description');

    res.json({
      success: true,
      data: alphabets,
      count: alphabets.length,
    });
  } catch (error: any) {
    console.error('Error fetching alphabets list:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch alphabets list',
    });
  }
});

export default router;

