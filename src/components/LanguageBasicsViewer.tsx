import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Volume2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/integrations/api/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

interface LanguageBasicsData {
  language: string;
  langCode: string;
  audioVerified?: boolean;
  letters: LetterItem[];
  numbers: NumberItem[];
  description: string;
  specialNotes?: string;
}

interface LanguageBasicsViewerProps {
  language: string; // spanish, french, german, chinese, english
}

export default function LanguageBasicsViewer({ language }: LanguageBasicsViewerProps) {
  const [data, setData] = useState<LanguageBasicsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [language]);

  const loadData = async () => {
    if (!language) {
      setError('Please select a language to begin.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getAlphabetData(language);
      
      if (response.data) {
        setData(response.data);
        toast.success(`Loaded ${response.data.language} alphabet!`);
      } else {
        throw new Error('No data returned from API');
      }
    } catch (error: any) {
      console.error('Error loading alphabet data:', error);
      setError(error.message || 'Failed to load lesson content');
      toast.error('Failed to load alphabet data', {
        description: 'Please try again later'
      });
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (!data) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use the language code from the data
      utterance.lang = data.langCode || 'en-US';
      utterance.rate = 0.8;
      
      // Set voice parameters for better pronunciation
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      window.speechSynthesis.speak(utterance);
      toast.success(`🔊 Speaking in ${data.language}`);
    } else {
      toast.info('Text-to-speech not supported in this browser');
    }
  };

  const getLanguageEmoji = (lang: string) => {
    const emojis: Record<string, string> = {
      spanish: '🇪🇸',
      french: '🇫🇷',
      german: '🇩🇪',
      english: '🇬🇧',
      chinese: '🇨🇳',
      italian: '🇮🇹',
      japanese: '🇯🇵',
      arabic: '🇸🇦',
    };
    return emojis[lang.toLowerCase()] || '🌐';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-lg text-muted-foreground">Loading alphabet...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'Failed to load lesson content. Please try again later.'}
          </AlertDescription>
        </Alert>
        <Button 
          onClick={loadData} 
          className="mt-4"
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold mb-2">
                {getLanguageEmoji(language)} {data.language} Alphabet & Numbers
              </CardTitle>
              <p className="text-lg text-muted-foreground">
                {data.letters.length} letters • {data.numbers.length} numbers
              </p>
            </div>
            <Badge className="text-lg px-4 py-2" variant="default">
              Level 1
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">{data.description}</p>
          {data.specialNotes && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Special Notes</AlertTitle>
              <AlertDescription>{data.specialNotes}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="alphabet" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alphabet" className="text-lg">
            🔤 Alphabet
          </TabsTrigger>
          <TabsTrigger value="numbers" className="text-lg">
            🔢 Numbers (1-20)
          </TabsTrigger>
        </TabsList>

        {/* Alphabet Tab */}
        <TabsContent value="alphabet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{data.language} Alphabet - {data.letters.length} Letters</span>
                <Badge variant="secondary">Click to hear pronunciation!</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {data.letters.map((item, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                      selectedLetter === item.char
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'hover:bg-blue-50 dark:hover:bg-blue-950/50'
                    }`}
                    onClick={() => {
                      setSelectedLetter(item.char);
                      speakText(item.char, language);
                    }}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      <div className="relative w-full h-16 mb-2">
                        <img
                          src={item.image}
                          alt={item.char}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&q=80';
                          }}
                        />
                      </div>
                      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {item.char}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.pronunciation}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(item.char, language);
                        }}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Numbers Tab */}
        <TabsContent value="numbers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{data.language} Numbers 1-20</span>
                <Badge variant="secondary">Click to hear!</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {data.numbers.map((item) => (
                  <Card
                    key={item.char}
                    className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                      selectedNumber === item.char
                        ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950'
                        : 'hover:bg-green-50 dark:hover:bg-green-950/50'
                    }`}
                    onClick={() => {
                      setSelectedNumber(item.char);
                      speakText(item.text, language);
                    }}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      <div className="relative w-full h-16 mb-2">
                        <img
                          src={item.image}
                          alt={item.char}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&q=80';
                          }}
                        />
                      </div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {item.char}
                      </div>
                      <div className="text-xl font-semibold">
                        {item.text}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.pronunciation}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(item.text, language);
                        }}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Practice Tips */}
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✨ Practice Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border-2 border-purple-200 dark:border-purple-800">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">1.</span>
                <span>Practice saying each letter and number out loud daily</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">2.</span>
                <span>Try spelling your name using the alphabet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">3.</span>
                <span>Count objects around you (1-20)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">4.</span>
                <span>Write each letter and number by hand to memorize</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">5.</span>
                <span>Use flashcards to test your memory</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

