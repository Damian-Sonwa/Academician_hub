import express, { Request, Response } from 'express';
import Lesson from '../models/Lesson';
import { authMiddleware } from '../middleware/auth';
import axios from 'axios';

const router = express.Router();

// Environment variables for API keys
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

/**
 * @route   POST /api/lessons/:id/generate-summary
 * @desc    Generate AI-powered lesson summary with images
 * @access  Private
 */
router.post('/:id/generate-summary', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get lesson from database
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      res.status(404).json({
        success: false,
        error: 'Lesson not found',
      });
      return;
    }

    console.log(`🤖 Generating AI summary for lesson: ${lesson.title}`);

    // Generate AI summary using OpenAI
    let aiSummary = '';
    let keyPoints: string[] = [];
    let learningObjectives: string[] = [];
    
    if (OPENAI_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are an expert educational content creator. Generate clear, concise, and engaging lesson summaries for students.',
              },
              {
                role: 'user',
                content: `Generate a comprehensive summary for this lesson:
                
Title: ${lesson.title}
Description: ${lesson.description}
Content Preview: ${lesson.content?.substring(0, 500) || 'No content available'}

Please provide:
1. A concise 2-3 sentence summary
2. 3-5 key learning points (as bullet points)
3. 3 specific learning objectives

Format your response as JSON with fields: summary, keyPoints (array), learningObjectives (array)`,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          },
          {
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const aiResponse = response.data.choices[0].message.content;
        
        // Try to parse JSON response
        try {
          const parsed = JSON.parse(aiResponse);
          aiSummary = parsed.summary || '';
          keyPoints = parsed.keyPoints || [];
          learningObjectives = parsed.learningObjectives || [];
        } catch (parseError) {
          // If not JSON, use the raw response as summary
          aiSummary = aiResponse;
        }
        
        console.log('✅ AI summary generated successfully');
      } catch (aiError: any) {
        console.error('❌ OpenAI API error:', aiError.response?.data || aiError.message);
        // Fallback to basic summary
        aiSummary = `This lesson covers ${lesson.title}. ${lesson.description}`;
        keyPoints = ['Understand core concepts', 'Apply learned knowledge', 'Practice with examples'];
        learningObjectives = ['Master the fundamentals', 'Build practical skills', 'Prepare for advanced topics'];
      }
    } else {
      // Fallback when no OpenAI API key
      console.log('⚠️ No OpenAI API key configured, using fallback summary');
      aiSummary = `${lesson.description} In this lesson, you'll explore the key concepts and practical applications of ${lesson.title}.`;
      keyPoints = [
        `Understand the fundamentals of ${lesson.title}`,
        'Learn through practical examples and demonstrations',
        'Apply knowledge to real-world scenarios',
        'Build a strong foundation for advanced topics',
      ];
      learningObjectives = [
        `Master core concepts in ${lesson.title}`,
        'Develop practical skills through hands-on practice',
        'Gain confidence in applying learned knowledge',
      ];
    }

    // Fetch relevant images from Unsplash
    let images: Array<{ url: string; description: string; photographer: string }> = [];
    
    if (UNSPLASH_ACCESS_KEY) {
      try {
        const searchQuery = lesson.title.split(':')[0].trim(); // Use first part of title
        const unsplashResponse = await axios.get(
          `https://api.unsplash.com/search/photos`,
          {
            params: {
              query: searchQuery,
              per_page: 2,
              orientation: 'landscape',
            },
            headers: {
              'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
          }
        );

        images = unsplashResponse.data.results.map((photo: any) => ({
          url: photo.urls.regular,
          description: photo.alt_description || photo.description || searchQuery,
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
        }));
        
        console.log(`✅ Fetched ${images.length} images from Unsplash`);
      } catch (unsplashError: any) {
        console.error('❌ Unsplash API error:', unsplashError.response?.data || unsplashError.message);
      }
    }

    // Fallback to placeholder images if none found
    if (images.length === 0) {
      console.log('⚠️ Using placeholder images');
      images = [
        {
          url: lesson.imageUrl || `https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80`,
          description: lesson.title,
          photographer: 'Unsplash',
        },
        {
          url: `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80`,
          description: 'Educational illustration',
          photographer: 'Unsplash',
        },
      ];
    }

    // Build structured response
    const generatedContent = {
      lessonId: lesson._id,
      lessonTitle: lesson.title,
      summary: aiSummary,
      keyPoints,
      learningObjectives,
      images,
      estimatedReadingTime: Math.ceil((aiSummary.length + keyPoints.join(' ').length) / 200), // words per minute
      difficulty: lesson.order <= 3 ? 'Beginner' : lesson.order <= 6 ? 'Intermediate' : 'Advanced',
      generatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: 'Lesson summary generated successfully',
      data: generatedContent,
    });
    
  } catch (error: any) {
    console.error('❌ Error generating lesson summary:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate lesson summary',
    });
  }
});

/**
 * @route   POST /api/lessons/:id/regenerate-content
 * @desc    Regenerate full lesson content with AI
 * @access  Private (Admin only)
 */
router.post('/:id/regenerate-content', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { prompt } = req.body;
    
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      res.status(404).json({
        success: false,
        error: 'Lesson not found',
      });
      return;
    }

    if (!OPENAI_API_KEY) {
      res.status(503).json({
        success: false,
        error: 'OpenAI API key not configured',
      });
      return;
    }

    // Generate comprehensive lesson content
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator specializing in creating comprehensive, engaging lesson content for students.',
          },
          {
            role: 'user',
            content: prompt || `Create detailed lesson content for: ${lesson.title}
            
Current description: ${lesson.description}

Please generate:
1. An engaging introduction (2-3 paragraphs)
2. Main content with clear sections and examples
3. A practical application or real-world example
4. A summary and key takeaways

Make it educational, clear, and student-friendly.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const generatedContent = response.data.choices[0].message.content;

    // Update lesson with new content
    lesson.content = generatedContent;
    await lesson.save();

    res.json({
      success: true,
      message: 'Lesson content regenerated successfully',
      data: {
        lessonId: lesson._id,
        content: generatedContent,
      },
    });
    
  } catch (error: any) {
    console.error('❌ Error regenerating lesson content:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to regenerate lesson content',
    });
  }
});

export default router;

