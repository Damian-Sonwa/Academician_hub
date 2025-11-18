import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Volume2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/integrations/api/client';
import { toast } from 'sonner';

interface LetterItem {
  char: string;
  pronunciation: string;
  image: string;
}

interface NumberItem {
  char: string;
  text: string;
  pronunciation: string;
  image: string;
}

interface AlphabetData {
  language: string;
  letters: LetterItem[];
  numbers: NumberItem[];
  description: string;
  specialNotes?: string;
}

const SUPPORTED_LANGUAGES = [
  { value: 'english', label: 'English 🇬🇧', flag: '🇬🇧' },
  { value: 'spanish', label: 'Spanish 🇪🇸', flag: '🇪🇸' },
  { value: 'french', label: 'French 🇫🇷', flag: '🇫🇷' },
  { value: 'german', label: 'German 🇩🇪', flag: '🇩🇪' },
  { value: 'chinese', label: 'Chinese 🇨🇳', flag: '🇨🇳' },
];

export default function AlphabetLearning() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [alphabetData, setAlphabetData] = useState<AlphabetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!selectedLanguage) {
      toast.error('Please select a language to begin');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching alphabet for: ${selectedLanguage}`);
      
      const response = await apiClient.getAlphabetData(selectedLanguage);
      
      if (response.data) {
        setAlphabetData(response.data);
        toast.success(`${response.data.language} alphabet loaded successfully!`);
      } else {
        throw new Error('No data returned from API');
      }
    } catch (err: any) {
      console.error('Error loading alphabet:', err);
      setError(err.message || 'Could not load data. Please try again.');
      toast.error('Failed to load alphabet data');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const langCodes: Record<string, string> = {
        english: 'en-US',
        spanish: 'es-ES',
        french: 'fr-FR',
        german: 'de-DE',
        chinese: 'zh-CN',
      };
      utterance.lang = langCodes[lang.toLowerCase()] || 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
      toast.success(`🔊 Speaking: ${text}`);
    } else {
      toast.info('Text-to-speech not supported in this browser');
    }
  };

  const handleReset = () => {
    setAlphabetData(null);
    setSelectedLanguage('');
    setError(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">🔤 Alphabet & Numbers Learning</h1>
        <p className="text-muted-foreground text-lg">
          Learn alphabets and numbers with pronunciation and images
        </p>
        <div className="inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
          ✅ UPDATED VERSION v2.0 - October 27, 2025
        </div>
      </div>

      {/* Language Selection */}
      {!alphabetData && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Select a Language to Begin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-lg">Choose Language *</label>
                <Select 
                  value={selectedLanguage} 
                  onValueChange={(value) => {
                    console.log('Language selected:', value);
                    setSelectedLanguage(value);
                    toast.success(`${value.charAt(0).toUpperCase() + value.slice(1)} selected!`);
                  }}
                >
                  <SelectTrigger className="w-full text-lg h-12 border-2">
                    <SelectValue placeholder="👆 Click here to select a language..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className="text-lg cursor-pointer">
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedLanguage && (
                  <p className="text-sm text-green-600 font-medium">
                    ✅ {SUPPORTED_LANGUAGES.find(l => l.value === selectedLanguage)?.label} selected
                  </p>
                )}
              </div>
              <Button
                onClick={handleStart}
                disabled={loading}
                size="lg"
                className="w-full md:w-auto h-12 text-lg px-8"
                variant={selectedLanguage ? "default" : "secondary"}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Start Learning
                  </>
                )}
              </Button>
            </div>

            {!selectedLanguage && !loading && (
              <Alert className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20 animate-pulse">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900 dark:text-blue-100">👆 Step 1: Select a Language</AlertTitle>
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  Click the dropdown above and choose a language to begin learning!
                </AlertDescription>
              </Alert>
            )}

            {selectedLanguage && !loading && !error && (
              <Alert className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900 dark:text-green-100">✅ Ready to Start!</AlertTitle>
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Now click the "Start Learning" button to load the {SUPPORTED_LANGUAGES.find(l => l.value === selectedLanguage)?.label} alphabet and numbers!
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading alphabet...</p>
            <p className="text-sm text-muted-foreground">
              Fetching {selectedLanguage} alphabet and numbers from database
            </p>
          </CardContent>
        </Card>
      )}

      {/* Alphabet Data Display */}
      {alphabetData && !loading && (
        <>
          {/* Header Info */}
          <Card className="border-2 border-primary bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">
                    {SUPPORTED_LANGUAGES.find(l => l.value === selectedLanguage)?.flag}{' '}
                    {alphabetData.language} Alphabet & Numbers
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {alphabetData.letters.length} letters • {alphabetData.numbers.length} numbers
                  </p>
                </div>
                <Button variant="outline" onClick={handleReset}>
                  Change Language
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">{alphabetData.description}</p>
              {alphabetData.specialNotes && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Special Notes</AlertTitle>
                  <AlertDescription>{alphabetData.specialNotes}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Alphabet Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🔤 Alphabet ({alphabetData.letters.length} letters)</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Click any letter to hear pronunciation
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {alphabetData.letters.map((letter, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 hover:border-primary"
                    onClick={() => speakText(letter.char, selectedLanguage)}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      {/* Image */}
                      <div className="relative w-full h-20 mb-2 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={letter.image}
                          alt={letter.char}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 
                              'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&q=80';
                          }}
                        />
                      </div>
                      {/* Character */}
                      <div className="text-4xl font-bold text-primary">
                        {letter.char}
                      </div>
                      {/* Pronunciation */}
                      <div className="text-sm text-muted-foreground">
                        {letter.pronunciation}
                      </div>
                      {/* Sound Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(letter.char, selectedLanguage);
                        }}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Numbers Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🔢 Numbers ({alphabetData.numbers.length} numbers)</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Click any number to hear pronunciation
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {alphabetData.numbers.map((number, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 hover:border-green-500"
                    onClick={() => speakText(number.text, selectedLanguage)}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      {/* Image */}
                      <div className="relative w-full h-20 mb-2 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={number.image}
                          alt={number.char}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 
                              'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&q=80';
                          }}
                        />
                      </div>
                      {/* Number */}
                      <div className="text-3xl font-bold text-green-600">
                        {number.char}
                      </div>
                      {/* Text */}
                      <div className="text-xl font-semibold">
                        {number.text}
                      </div>
                      {/* Pronunciation */}
                      <div className="text-sm text-muted-foreground">
                        {number.pronunciation}
                      </div>
                      {/* Sound Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(number.text, selectedLanguage);
                        }}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Practice Tips */}
          <Card className="border-2 border-purple-500">
            <CardHeader>
              <CardTitle>✨ Practice Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">1.</span>
                  <span>Click each letter and number to hear the correct pronunciation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">2.</span>
                  <span>Try spelling your name using the alphabet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">3.</span>
                  <span>Count objects around you using the numbers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">4.</span>
                  <span>Write each letter and number by hand to memorize better</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">5.</span>
                  <span>Practice daily for 10-15 minutes for best results</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

