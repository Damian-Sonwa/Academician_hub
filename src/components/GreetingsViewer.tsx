import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Volume2, MessageCircle, BookOpen, Users, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface GreetingExample {
  phrase: string;
  pronunciation: string;
  english: string;
  context: string;
  formality: 'formal' | 'informal' | 'neutral';
}

interface GreetingCategory {
  category: string;
  description: string;
  greetings: GreetingExample[];
}

interface LanguageGreetingsProps {
  language: string;
  data: {
    langCode?: string;
    overview: string;
    culturalNotes: string;
    mainImage: string;
    images: string[];
    categories: GreetingCategory[];
    commonResponses: {
      greeting: string;
      responses: string[];
    }[];
    practiceDialogues: {
      title: string;
      dialogue: { speaker: string; text: string; translation: string }[];
    }[];
  };
}

export default function GreetingsViewer({ language, data }: LanguageGreetingsProps) {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use langCode from data if available, otherwise fallback
      const langCode = data.langCode || 'en-US';
      utterance.lang = langCode;
      utterance.rate = 0.8; // Slower for learning
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      setPlayingAudio(text);
      utterance.onend = () => setPlayingAudio(null);
      
      window.speechSynthesis.speak(utterance);
      toast.success(`🔊 Playing: ${text}`);
    } else {
      toast.info('Text-to-speech not supported in this browser');
    }
  };

  const getFormalityColor = (formality: string) => {
    switch (formality) {
      case 'formal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'informal':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getFormalityIcon = (formality: string) => {
    switch (formality) {
      case 'formal':
        return '🎩';
      case 'informal':
        return '😊';
      default:
        return '💬';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header with Main Image */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={data.mainImage}
          alt={`${language} greetings`}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-4xl font-bold mb-2">
              🤝 {language} Greetings & Introductions
            </h1>
            <p className="text-lg opacity-90">
              Master the art of greeting people in {language}
            </p>
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">{data.overview}</p>
          
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Cultural Notes
            </h3>
            <p className="text-blue-800 dark:text-blue-200">{data.culturalNotes}</p>
          </div>
        </CardContent>
      </Card>

      {/* Greeting Categories */}
      <Tabs defaultValue="0" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2">
          {data.categories.map((category, index) => (
            <TabsTrigger key={index} value={index.toString()} className="text-sm py-2">
              {category.category}
            </TabsTrigger>
          ))}
        </TabsList>

        {data.categories.map((category, categoryIndex) => (
          <TabsContent key={categoryIndex} value={categoryIndex.toString()} className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
                <p className="text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {category.greetings.map((greeting, greetingIndex) => (
                    <Card
                      key={greetingIndex}
                      className="border-2 hover:border-primary/50 transition-all hover:shadow-md"
                    >
                      <CardContent className="pt-6 space-y-3">
                        {/* Phrase and Audio */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="text-2xl font-bold text-primary mb-1">
                              {greeting.phrase}
                            </div>
                            <div className="text-sm text-muted-foreground italic">
                              {greeting.pronunciation}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => speakText(greeting.phrase, language)}
                            className="shrink-0"
                          >
                            <Volume2
                              className={`h-4 w-4 ${
                                playingAudio === greeting.phrase ? 'animate-pulse' : ''
                              }`}
                            />
                          </Button>
                        </div>

                        {/* English Translation */}
                        <div className="text-lg font-medium">{greeting.english}</div>

                        {/* Context */}
                        <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                          💡 {greeting.context}
                        </div>

                        {/* Formality Badge */}
                        <Badge className={getFormalityColor(greeting.formality)}>
                          {getFormalityIcon(greeting.formality)} {greeting.formality.charAt(0).toUpperCase() + greeting.formality.slice(1)}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Common Responses Section */}
      <Card className="border-2 border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Common Responses
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Learn how to respond to common greetings
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.commonResponses.map((item, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">"{item.greeting}"</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => speakText(item.greeting, language)}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="pl-6 space-y-2">
                {item.responses.map((response, respIndex) => (
                  <div
                    key={respIndex}
                    className="flex items-center gap-2 p-2 rounded hover:bg-white/50 dark:hover:bg-gray-800/50"
                  >
                    <span className="text-green-600 dark:text-green-400">→</span>
                    <span className="flex-1">{response}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => speakText(response, language)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Practice Dialogues */}
      <Card className="border-2 border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            Practice Dialogues
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-world conversation examples
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.practiceDialogues.map((dialogue, dialogueIndex) => (
            <Card key={dialogueIndex} className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">{dialogue.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dialogue.dialogue.map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className={`p-4 rounded-lg ${
                      lineIndex % 2 === 0
                        ? 'bg-blue-50 dark:bg-blue-950/30 ml-0 mr-12'
                        : 'bg-green-50 dark:bg-green-950/30 ml-12 mr-0'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span className="font-semibold text-sm text-muted-foreground">
                        {line.speaker}:
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => speakText(line.text, language)}
                        className="ml-auto"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-lg font-medium mb-1">{line.text}</div>
                    <div className="text-sm text-muted-foreground italic">
                      {line.translation}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Image Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.images.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`${language} greeting example ${index + 1}`}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Message */}
      <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-purple-500/5">
        <CardContent className="pt-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-2">Great Job!</h3>
          <p className="text-muted-foreground mb-4">
            You've learned the essential greetings in {language}. Practice these daily to build confidence!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              {data.categories.reduce((total, cat) => total + cat.greetings.length, 0)} Phrases Learned
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              {data.practiceDialogues.length} Dialogues Completed
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

