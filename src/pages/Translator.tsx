import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Volume2, Languages, X } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/integrations/api/client';

interface TranslatorEntry {
  _id?: string;
  word: string;
  language: string;
  meaning: string;
  pronunciation?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  audioUrl?: string;
  partOfSpeech?: string;
  meanings?: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
    synonyms?: string[];
    antonyms?: string[];
  }>;
  sourceUrls?: string[];
  note?: string;
}

const languages = [
  { value: 'english', label: 'English', flag: '🇬🇧' },
  { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { value: 'french', label: 'French', flag: '🇫🇷' },
  { value: 'german', label: 'German', flag: '🇩🇪' },
  { value: 'italian', label: 'Italian', flag: '🇮🇹' },
  { value: 'chinese', label: 'Chinese', flag: '🇨🇳' },
  { value: 'japanese', label: 'Japanese', flag: '🇯🇵' },
  { value: 'arabic', label: 'Arabic', flag: '🇸🇦' },
];

export default function Translator() {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [searchWord, setSearchWord] = useState('');
  const [result, setResult] = useState<TranslatorEntry | null>(null);
  const [partialResults, setPartialResults] = useState<TranslatorEntry[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchWord.trim()) {
      toast.error('Please enter a word to translate');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setResult(null);
    setPartialResults([]);

    try {
      const response = await apiClient.searchTranslator(searchWord.trim(), selectedLanguage);

      // Handle both response formats: { data: {...} } or direct {...}
      const data = (response as any).data || response;

      if (data.exactMatch && data.result) {
        setResult(data.result);
        setPartialResults([]);
      } else if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        setPartialResults(data.results);
        setResult(null);
      } else {
        toast.info(data.message || 'No results found. Try a different word or language.');
        setResult(null);
        setPartialResults([]);
      }
    } catch (error: any) {
      console.error('Translator search error:', error);
      const errorMessage = error.message || error.data?.error || error.data?.details || 'Failed to translate word';
      toast.error(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlayAudio = (audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(err => {
        console.error('Audio playback error:', err);
        toast.error('Unable to play audio');
      });
    } else {
      toast.info('Audio pronunciation not available for this word');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Languages className="h-10 w-10 text-primary" />
          Translator
        </h1>
        <p className="text-muted-foreground">
          Translate words and phrases, get definitions, pronunciations, and examples in multiple languages
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Translate Word</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.flag} {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter a word or phrase..."
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-10"
                />
                {searchWord && (
                  <button
                    onClick={() => {
                      setSearchWord('');
                      setResult(null);
                      setPartialResults([]);
                      setHasSearched(false);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchWord.trim()}
              className="w-full md:w-auto"
            >
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? 'Translating...' : 'Translate'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-4">
          {/* Exact Match Result */}
          {result && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2 capitalize">{result.word}</CardTitle>
                    {result.partOfSpeech && (
                      <Badge variant="secondary" className="mr-2">
                        {result.partOfSpeech}
                      </Badge>
                    )}
                    {result.pronunciation && (
                      <span className="text-muted-foreground text-sm">
                        /{result.pronunciation}/
                      </span>
                    )}
                  </div>
                  {result.audioUrl && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePlayAudio(result.audioUrl)}
                      className="ml-2"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Show all meanings if available, otherwise show single meaning */}
                {result.meanings && result.meanings.length > 0 ? (
                  <div className="space-y-4">
                    {result.meanings.map((meaning, meaningIndex) => (
                      <div key={meaningIndex} className="border-l-4 border-primary pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-sm font-semibold">
                            {meaning.partOfSpeech}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          {meaning.definitions.map((def, defIndex) => (
                            <div key={defIndex} className="space-y-2">
                              <p className="text-foreground">
                                <span className="font-semibold text-primary">{defIndex + 1}.</span> {def.definition}
                              </p>
                              {def.example && (
                                <p className="text-sm text-muted-foreground italic ml-4">
                                  "{def.example}"
                                </p>
                              )}
                            </div>
                          ))}
                          {meaning.synonyms && meaning.synonyms.length > 0 && (
                            <div className="mt-2">
                              <span className="text-sm font-semibold text-muted-foreground">Synonyms: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {meaning.synonyms.slice(0, 5).map((synonym, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">{synonym}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {meaning.antonyms && meaning.antonyms.length > 0 && (
                            <div className="mt-2">
                              <span className="text-sm font-semibold text-muted-foreground">Antonyms: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {meaning.antonyms.slice(0, 5).map((antonym, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">{antonym}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold mb-2">Translation / Meaning</h3>
                    <p className="text-foreground">{result.meaning}</p>
                  </div>
                )}

                {/* General Examples */}
                {result.examples && result.examples.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Examples</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {result.examples.map((example, index) => (
                        <li key={index} className="text-muted-foreground">{example}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* General Synonyms */}
                {result.synonyms && result.synonyms.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Synonyms</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.synonyms.map((synonym, index) => (
                        <Badge key={index} variant="outline">{synonym}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* General Antonyms */}
                {result.antonyms && result.antonyms.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Antonyms</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.antonyms.map((antonym, index) => (
                        <Badge key={index} variant="outline">{antonym}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source URLs */}
                {result.sourceUrls && result.sourceUrls.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Sources</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.sourceUrls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Source {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {result.note && (
                  <div className="text-sm text-muted-foreground italic mt-4">
                    {result.note}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Partial Match Results */}
          {partialResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Similar Words</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partialResults.map((entry, index) => (
                    <div
                      key={entry._id || `${entry.word}-${index}`}
                      className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => {
                        setResult(entry);
                        setPartialResults([]);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold capitalize">{entry.word}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{entry.meaning}</p>
                        </div>
                        {entry.audioUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayAudio(entry.audioUrl);
                            }}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {!result && partialResults.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No translation found for "{searchWord}" in {languages.find(l => l.value === selectedLanguage)?.label}.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try a different spelling or search in another language.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!hasSearched && (
        <Card>
          <CardContent className="py-12 text-center">
            <Languages className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Start Translating</h3>
            <p className="text-muted-foreground">
              Select a language and enter a word or phrase to translate, get definitions, and see examples.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



