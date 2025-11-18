import express from 'express';

const router = express.Router();

// Map our language names to Dictionary API language codes
const languageCodeMap: { [key: string]: string } = {
  'english': 'en',
  'spanish': 'es',
  'french': 'fr',
  'german': 'de',
  'italian': 'it',
  'chinese': 'zh',
  'japanese': 'ja',
  'arabic': 'ar',
};

// Free Dictionary APIs (no API key required)
const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries'; // English only
const WIKTIONARY_API_URL = 'https://en.wiktionary.org/api/rest_v1/page/definition'; // Multiple languages

// Languages that require native script (not English words)
const requiresNativeScript: { [key: string]: { examples: string[]; note: string } } = {
  'chinese': {
    examples: ['你好 (hello)', '书 (book)', '水 (water)', '人 (person)', '学 (learn)'],
    note: 'Please search using Chinese characters (汉字). Note: DictionaryAPI.dev has limited Chinese word coverage.'
  },
  'japanese': {
    examples: ['時間 (time)', 'こんにちは (hello)', '本 (book)', '水 (water)', '友達 (friend)'],
    note: 'Please search using Japanese characters (hiragana, katakana, or kanji).'
  },
  'arabic': {
    examples: ['وقت (time)', 'مرحبا (hello)', 'كتاب (book)', 'ماء (water)', 'صديق (friend)'],
    note: 'Please search using Arabic script (العربية).'
  }
};

// Languages with limited support in DictionaryAPI.dev
const limitedSupportLanguages = ['arabic', 'chinese', 'japanese'];

// Helper function to detect if a string contains Chinese characters
function containsChineseChars(str: string): boolean {
  return /[\u4e00-\u9fff]/.test(str);
}

// Helper function to detect if a string contains Japanese characters
function containsJapaneseChars(str: string): boolean {
  return /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(str);
}

// Helper function to detect if a string contains Arabic characters
function containsArabicChars(str: string): boolean {
  return /[\u0600-\u06ff]/.test(str);
}

/**
 * Search for words in a specific language using Free Dictionary API (dictionaryapi.dev)
 * 
 * Supported Languages:
 * - English (en): Full support - search with English words
 * - Spanish (es): Full support - search with Spanish words
 * - French (fr): Full support - search with French words
 * - German (de): Full support - search with German words
 * - Italian (it): Full support - search with Italian words
 * - Chinese (zh): Requires Chinese characters (汉字) - Limited coverage
 * - Japanese (ja): Requires Japanese characters - Limited coverage
 * - Arabic (ar): Requires Arabic script - Limited coverage
 * 
 * GET /api/dictionary/search?word=hello&language=english
 */
router.get('/search', async (req, res) => {
  try {
    const { word, language } = req.query;

    if (!word || !language) {
      return res.status(400).json({ 
        error: 'Word and language parameters are required' 
      });
    }

    const searchWord = (word as string).trim();
    const searchLanguage = (language as string).toLowerCase();

    // Validate language
    const validLanguages = ['english', 'french', 'german', 'italian', 'spanish', 'chinese', 'japanese', 'arabic'];
    if (!validLanguages.includes(searchLanguage)) {
      return res.status(400).json({ 
        error: `Invalid language. Must be one of: ${validLanguages.join(', ')}` 
      });
    }

    // Get language code for Dictionary API
    const langCode = languageCodeMap[searchLanguage];
    if (!langCode) {
      return res.status(400).json({ 
        error: `Language code not found for: ${searchLanguage}` 
      });
    }

    // For English, use dictionaryapi.dev; for other languages, use translation-based approach
    if (searchLanguage === 'english') {
      // Use Free Dictionary API for English
      const apiUrl = `${DICTIONARY_API_URL}/${langCode}/${encodeURIComponent(searchWord)}`;
      
      try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          if (response.status === 404) {
            return res.json({
              exactMatch: false,
              results: [],
              message: `No dictionary entry found for "${searchWord}" in English. Try checking the spelling or searching for a different word.`,
            });
          }
          
          if (response.status === 500 || response.status >= 500) {
            return res.status(500).json({
              error: 'Dictionary service error',
              message: `The dictionary service is temporarily unavailable. Please try again later.`,
            });
          }
          
          throw new Error(`Dictionary API returned status ${response.status}`);
        }

        let data;
        try {
          data = await response.json();
        } catch (parseError: any) {
          console.error('JSON parse error:', parseError);
          throw new Error('Invalid response from dictionary API');
        }
        
        if (!Array.isArray(data) || data.length === 0) {
          return res.json({
            exactMatch: false,
            results: [],
            message: `No dictionary entry found for "${searchWord}" in English.`,
          });
        }

        const entry = data[0];

        // Transform Dictionary API response to our format
        const transformedEntry = {
          word: entry.word || searchWord,
          language: searchLanguage,
          meaning: entry.meanings?.[0]?.definitions?.[0]?.definition || 'No definition available',
          pronunciation: entry.phonetic || entry.phonetics?.[0]?.text || '',
          examples: entry.meanings?.flatMap((meaning: any) => 
            meaning.definitions?.map((def: any) => def.example).filter(Boolean) || []
          ) || [],
          synonyms: entry.meanings?.flatMap((meaning: any) => meaning.synonyms || []).slice(0, 10) || [],
          antonyms: entry.meanings?.flatMap((meaning: any) => meaning.antonyms || []).slice(0, 10) || [],
          audioUrl: entry.phonetics?.find((p: any) => p.audio)?.audio || '',
          partOfSpeech: entry.meanings?.[0]?.partOfSpeech || '',
          meanings: entry.meanings || [],
          sourceUrls: entry.sourceUrls || [],
        };

        return res.json({
          exactMatch: true,
          result: transformedEntry,
        });
      } catch (fetchError: any) {
        console.error('Dictionary API fetch error:', fetchError);
        throw fetchError;
      }
    } else {
      // For non-English languages, use LibreTranslate (free, no API key) for translation
      try {
        // First, try to get translation from LibreTranslate
        const translateUrl = 'https://libretranslate.de/translate';
        const translateResponse = await fetch(translateUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: searchWord,
            source: langCode,
            target: 'en',
            format: 'text',
          }),
        });

        // Check if response is JSON
        const contentType = translateResponse.headers.get('content-type');
        let translateData: any = null;
        let translatedText = searchWord;

        if (translateResponse.ok && contentType && contentType.includes('application/json')) {
          try {
            translateData = await translateResponse.json();
            translatedText = translateData.translatedText || searchWord;
          } catch (parseError: any) {
            console.error('Failed to parse LibreTranslate response:', parseError);
            // Fall through to MyMemory fallback
          }
        }

        // If LibreTranslate failed or returned HTML, use MyMemory as fallback
        if (!translateData || !translatedText || translatedText === searchWord) {
          const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(searchWord)}&langpair=${langCode}|en`;
          const myMemoryResponse = await fetch(myMemoryUrl);
          
          if (myMemoryResponse.ok) {
            try {
              const myMemoryData = await myMemoryResponse.json();
              translatedText = myMemoryData.responseData?.translatedText || searchWord;
              
              // If translation is the same as input or empty, it might have failed
              if (translatedText === searchWord || !translatedText) {
                throw new Error('Translation not available');
              }
            } catch (myMemoryError: any) {
              console.error('MyMemory API error:', myMemoryError);
              // Fall through to error handling
            }
          }

          // If both APIs failed, return error
          if (!translatedText || translatedText === searchWord) {
            let message = `No dictionary entry found for "${searchWord}" in ${searchLanguage}.`;
            
            const isUsingCorrectScript = 
              (searchLanguage === 'chinese' && containsChineseChars(searchWord)) ||
              (searchLanguage === 'japanese' && containsJapaneseChars(searchWord)) ||
              (searchLanguage === 'arabic' && containsArabicChars(searchWord));
            
            if (requiresNativeScript[searchLanguage]) {
              if (!isUsingCorrectScript) {
                const langInfo = requiresNativeScript[searchLanguage];
                message += ` ${langInfo.note} Try searching with: ${langInfo.examples.join(', ')}`;
              } else {
                message += ` The word might not be available. Try: ${requiresNativeScript[searchLanguage].examples.join(', ')}`;
              }
            } else {
              message += ` Try checking the spelling or searching for a different word.`;
            }
            
            return res.json({
              exactMatch: false,
              results: [],
              message: message,
            });
          }
        }

        const transformedEntry = {
          word: searchWord,
          language: searchLanguage,
          meaning: `Translation: ${translatedText}`,
          pronunciation: '',
          examples: [`"${searchWord}" means "${translatedText}" in English`],
          synonyms: [],
          antonyms: [],
          audioUrl: '',
          partOfSpeech: '',
          meanings: [{
            partOfSpeech: '',
            definitions: [{
              definition: `"${searchWord}" translates to "${translatedText}" in English`,
              example: `Example: "${searchWord}" = "${translatedText}"`,
            }],
          }],
          sourceUrls: [],
          note: 'Translation provided by free translation service. For detailed definitions, consider using an English dictionary.',
        };

        return res.json({
          exactMatch: true,
          result: transformedEntry,
        });
      } catch (fetchError: any) {
        console.error('Translation API fetch error:', fetchError);
        
        // Try MyMemory as fallback
        try {
          const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(searchWord)}&langpair=${langCode}|en`;
          const myMemoryResponse = await fetch(myMemoryUrl);
          
          if (myMemoryResponse.ok) {
            const myMemoryData = await myMemoryResponse.json();
            const translatedText = myMemoryData.responseData?.translatedText || searchWord;
            
            const transformedEntry = {
              word: searchWord,
              language: searchLanguage,
              meaning: `Translation: ${translatedText}`,
              pronunciation: '',
              examples: [`"${searchWord}" means "${translatedText}" in English`],
              synonyms: [],
              antonyms: [],
              audioUrl: '',
              partOfSpeech: '',
              meanings: [{
                partOfSpeech: '',
                definitions: [{
                  definition: `"${searchWord}" translates to "${translatedText}" in English`,
                  example: `Example: "${searchWord}" = "${translatedText}"`,
                }],
              }],
              sourceUrls: [],
              note: 'Translation provided by free translation service. For detailed definitions, consider using an English dictionary.',
            };

            return res.json({
              exactMatch: true,
              result: transformedEntry,
            });
          }
        } catch (fallbackError: any) {
          console.error('Fallback translation API error:', fallbackError);
        }
        
        // Handle network errors
        if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
          return res.status(503).json({
            error: 'Service unavailable',
            message: 'Unable to connect to translation service. Please check your internet connection and try again.',
          });
        }
        
        throw new Error(`Failed to fetch translation: ${fetchError.message}`);
      }
    }
  } catch (error: any) {
    console.error('Dictionary search error:', error);
    res.status(500).json({ error: 'Failed to search dictionary', details: error.message });
  }
});

/**
 * Get all words for a specific language (paginated)
 * NOTE: Free Dictionary API doesn't support listing all words.
 * This endpoint is kept for API compatibility but returns a message.
 * GET /api/dictionary/words?language=english&page=1&limit=20
 */
router.get('/words', async (req, res) => {
  res.status(501).json({ 
    error: 'Not supported',
    message: 'Free Dictionary API does not support listing all words. Please use the /search endpoint to look up specific words.'
  });
});

/**
 * Add a new dictionary entry
 * NOTE: Free Dictionary API is read-only. Custom entries cannot be added.
 * POST /api/dictionary
 */
router.post('/', async (req, res) => {
  res.status(501).json({ 
    error: 'Not supported',
    message: 'Free Dictionary API is read-only. Custom dictionary entries cannot be added.'
  });
});

/**
 * Update a dictionary entry
 * NOTE: Free Dictionary API is read-only. Entries cannot be updated.
 * PUT /api/dictionary/:id
 */
router.put('/:id', async (req, res) => {
  res.status(501).json({ 
    error: 'Not supported',
    message: 'Free Dictionary API is read-only. Dictionary entries cannot be updated.'
  });
});

/**
 * Delete a dictionary entry
 * NOTE: Free Dictionary API is read-only. Entries cannot be deleted.
 * DELETE /api/dictionary/:id
 */
router.delete('/:id', async (req, res) => {
  res.status(501).json({ 
    error: 'Not supported',
    message: 'Free Dictionary API is read-only. Dictionary entries cannot be deleted.'
  });
});

export default router;

