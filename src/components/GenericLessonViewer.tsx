import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, FileText, ExternalLink, CheckCircle, ClipboardList, HelpCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { apiClient } from '@/integrations/api/client';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  content?: string;
  duration: number;
  order: number;
  videoUrl?: string;
  imageUrl?: string;
  images?: string[];
  resources: string[];
  assignments?: Array<{
    title: string;
    description: string;
    tasks: string[];
  }>;
  quiz?: {
    questions: Array<{
      question: string;
      options?: string[];
      correctAnswer: number | string;
      explanation: string;
      type?: 'multiple-choice' | 'true-false' | 'short-answer';
    }>;
  };
  isCompleted: boolean;
}

interface GenericLessonViewerProps {
  lesson: Lesson;
  onComplete?: () => void;
  courseId?: string;
}

/**
 * Format lesson content from markdown to HTML
 */
function formatLessonContent(content: string): string {
  if (!content) return '';
  
  let html = content;

  // Convert code blocks first (before other processing)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-slate-900 dark:bg-slate-950 text-slate-100 p-6 rounded-xl overflow-x-auto my-6 border border-slate-700 shadow-lg"><code class="text-sm font-mono leading-relaxed">${code.trim()}</code></pre>`;
  });

  // Convert markdown images ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-xl my-8 shadow-xl border-2 border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-shadow duration-300" onerror="this.src=\'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80\'" />');

  // Convert inline code (simple approach - avoid lookbehind)
  html = html.replace(/`([^`\n]+)`/g, (match, code) => {
    // Skip if inside a code block (already processed)
    if (html.includes(`<pre`) && html.indexOf(match) > html.lastIndexOf('</pre>')) {
      return match;
    }
    return `<code class="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 py-1 rounded-md text-sm font-mono border border-slate-200 dark:border-slate-700">${code}</code>`;
  });

  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-slate-100">$1</strong>');

  // Convert italic (simple - avoid lookbehind, process after bold)
  // This is a simplified approach - may need refinement
  html = html.replace(/\*([^*\n]+)\*/g, (match, text) => {
    // Skip if already bold
    if (match.includes('**')) return match;
    return `<em class="italic">${text}</em>`;
  });

  // Split into lines for processing
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Headers
    if (trimmed.startsWith('# ')) {
      if (inList) {
        processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
        inList = false;
        listType = null;
      }
      processedLines.push(`<h1 class="text-4xl font-bold mt-8 mb-6 text-slate-900 dark:text-slate-100 leading-tight">${trimmed.substring(2)}</h1>`);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      if (inList) {
        processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
        inList = false;
        listType = null;
      }
      processedLines.push(`<h2 class="text-3xl font-bold mt-8 mb-4 text-slate-800 dark:text-slate-200 leading-tight border-b border-slate-200 dark:border-slate-700 pb-2">${trimmed.substring(3)}</h2>`);
      continue;
    }
    if (trimmed.startsWith('### ')) {
      if (inList) {
        processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
        inList = false;
        listType = null;
      }
      processedLines.push(`<h3 class="text-2xl font-semibold mt-6 mb-3 text-slate-700 dark:text-slate-300 leading-snug">${trimmed.substring(4)}</h3>`);
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      if (inList) {
        processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
        inList = false;
        listType = null;
      }
      processedLines.push(`<h4 class="text-xl font-semibold mt-5 mb-2 text-slate-700 dark:text-slate-300">${trimmed.substring(5)}</h4>`);
      continue;
    }

    // Lists
    if (/^[-*] /.test(trimmed)) {
      if (!inList || listType !== 'ul') {
        if (inList && listType === 'ol') {
          processedLines.push('</ol>');
        }
        processedLines.push('<ul class="list-disc ml-6 my-4 space-y-3 text-slate-700 dark:text-slate-300">');
        inList = true;
        listType = 'ul';
      }
      processedLines.push(`<li class="ml-2 leading-relaxed">${trimmed.substring(2)}</li>`);
      continue;
    }
    if (/^\d+\. /.test(trimmed)) {
      if (!inList || listType !== 'ol') {
        if (inList && listType === 'ul') {
          processedLines.push('</ul>');
        }
        processedLines.push('<ol class="list-decimal ml-6 my-4 space-y-3 text-slate-700 dark:text-slate-300">');
        inList = true;
        listType = 'ol';
      }
      processedLines.push(`<li class="ml-2 leading-relaxed">${trimmed.replace(/^\d+\. /, '')}</li>`);
      continue;
    }

    // Empty line - close list if open, add paragraph break
    if (trimmed === '') {
      if (inList) {
        processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
        inList = false;
        listType = null;
      }
      continue;
    }

    // Regular paragraph
    if (inList) {
      processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
      inList = false;
      listType = null;
    }
    
    // Skip if already processed (contains HTML tags)
    if (trimmed.includes('<')) {
      processedLines.push(line);
    } else {
      processedLines.push(`<p class="mb-6 text-base leading-7 text-slate-700 dark:text-slate-300">${trimmed}</p>`);
    }
  }

  // Close any open list
  if (inList) {
    processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
  }

  return processedLines.join('\n');
}

export default function GenericLessonViewer({ lesson, onComplete, courseId }: GenericLessonViewerProps) {
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number | string>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  // Check if lesson has quiz
  const hasQuiz = lesson.quiz && lesson.quiz.questions && lesson.quiz.questions.length > 0;
  const minPassingScore = 70; // 70% required to pass

  const handleWatchVideo = () => {
    if (lesson.videoUrl) {
      window.open(lesson.videoUrl, '_blank', 'noopener,noreferrer');
      toast.success('Opening video in new tab');
    } else {
      toast.info('Video content coming soon!');
    }
  };

  const handleQuizSubmit = async () => {
    if (!lesson.quiz || !lesson.quiz.questions) {
      toast.error('No quiz available for this lesson');
      return;
    }

    // Check if all questions are answered
    const totalQuestions = lesson.quiz.questions.length;
    const answeredQuestions = Object.keys(selectedQuizAnswers).length;
    
    if (answeredQuestions < totalQuestions) {
      toast.error(`Please answer all ${totalQuestions} questions before submitting.`);
      return;
    }

    setIsSubmittingQuiz(true);

    try {
      let correct = 0;
      lesson.quiz.questions.forEach((q, index) => {
        if (Number(selectedQuizAnswers[index]) === Number(q.correctAnswer)) {
          correct++;
        }
      });

      const total = lesson.quiz.questions.length;
      const percentage = Math.round((correct / total) * 100);
      
      setQuizScore(percentage);
      setShowQuizResults(true);
      
      // Save quiz score to backend
      if (courseId) {
        try {
          await apiClient.updateProgress({
            courseId,
            lessonId: lesson._id,
            quizScore: percentage,
            completed: false, // Don't complete lesson yet
          });
        } catch (error: any) {
          console.error('Error saving quiz score:', error);
          // Don't show error to user, just log it
        }
      }
      
      if (percentage >= minPassingScore) {
        setQuizPassed(true);
        toast.success(`🎉 Quiz passed! Score: ${correct}/${total} (${percentage}%)`);
      } else {
        setQuizPassed(false);
        toast.error(`Quiz score: ${correct}/${total} (${percentage}%). You need ${minPassingScore}% to pass. Please review the lesson and try again.`);
      }
    } catch (error: any) {
      toast.error('Error submitting quiz: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const handleCompleteLesson = async () => {
    // Check if quiz is required and passed
    if (hasQuiz && !quizPassed) {
      toast.error(`You must pass the quiz (${minPassingScore}% or higher) before completing this lesson. Please complete the quiz first.`);
      return;
    }

    if (onComplete) {
      try {
        // Call onComplete which will handle the completion API call
        await onComplete();
      } catch (error: any) {
        // If error indicates quiz requirement, show appropriate message
        if (error.data?.quizRequired || error.data?.requiresQuiz) {
          toast.error(error.message || 'You must pass the quiz before completing this lesson.');
        } else {
          throw error; // Re-throw other errors
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 shadow-lg">
        <CardHeader className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="default" className="text-base px-4 py-1.5 font-semibold bg-primary/90">
                  Lesson {lesson.order}
                </Badge>
                {lesson.isCompleted && (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <CardTitle className="text-4xl font-bold mb-3 text-slate-900 dark:text-slate-100 leading-tight">{lesson.title}</CardTitle>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{lesson.description}</p>
            </div>
            <div className="text-center md:text-right bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Duration</p>
              <p className="text-3xl font-bold text-primary">{lesson.duration} min</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lesson Content */}
      <Card className="shadow-lg border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            Lesson Content
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {lesson.content ? (
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
              <div 
                className="text-base leading-relaxed text-slate-700 dark:text-slate-300"
                dangerouslySetInnerHTML={{ 
                  __html: formatLessonContent(lesson.content)
                }}
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-12 rounded-xl text-center border-2 border-dashed border-slate-300 dark:border-slate-700">
              <BookOpen className="h-16 w-16 mx-auto mb-6 text-slate-400 dark:text-slate-500" />
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                Detailed lesson content for "{lesson.title}" is being prepared.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please check back soon or watch the video below!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Images */}
      {lesson.images && lesson.images.length > 0 && (
        <Card className="shadow-lg border-slate-200 dark:border-slate-800">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="text-2xl">📸</span>
              Visual Learning Aids
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lesson.images.map((image, index) => (
                <div key={index} className="relative rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <img
                    src={image}
                    alt={`Illustration ${index + 1}`}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Section */}
      <Card className="border-2 border-blue-300 dark:border-blue-700 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-b border-blue-200 dark:border-blue-800">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            Video Lesson
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-8 rounded-xl border border-blue-200 dark:border-blue-800 shadow-md">
            <p className="mb-6 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Watch the video lesson to get a comprehensive understanding of this topic.
            </p>
            <Button 
              size="lg" 
              onClick={handleWatchVideo}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6"
            >
              <Video className="h-5 w-5 mr-2" />
              Watch Video Lesson
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <Card className="border-2 border-green-300 dark:border-green-700 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b border-green-200 dark:border-green-800">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              Additional Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {lesson.resources.map((resource, index) => (
                <li key={index} className="flex items-center gap-3 p-4 bg-white/70 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 shadow-sm hover:shadow-md group">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="flex-1 text-slate-700 dark:text-slate-300 font-medium">{resource}</span>
                  <Button variant="ghost" size="sm" className="group-hover:bg-green-100 dark:group-hover:bg-green-900/30">
                    <ExternalLink className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Assignments Section */}
      {lesson.assignments && lesson.assignments.length > 0 && (
        <Card className="border-2 border-orange-300 dark:border-orange-700 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-b border-orange-200 dark:border-orange-800">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <ClipboardList className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {lesson.assignments.map((assignment, assignmentIndex) => (
              <div key={assignmentIndex} className="bg-white/70 dark:bg-slate-800/70 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-100">{assignment.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">{assignment.description}</p>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Tasks:</h4>
                  <ol className="list-decimal list-inside space-y-3 ml-2 text-slate-700 dark:text-slate-300">
                    {assignment.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="leading-relaxed">{task}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quiz Section */}
      {lesson.quiz && lesson.quiz.questions && lesson.quiz.questions.length > 0 && (
        <Card className="border-2 border-blue-300 dark:border-blue-700 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-b border-blue-200 dark:border-blue-800">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              Quiz ({lesson.quiz.questions.length} questions)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {lesson.quiz.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="bg-white/70 dark:bg-slate-800/70 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
                <div className="flex items-start gap-3 mb-4">
                  <Badge variant="outline" className="mt-1 text-base font-semibold px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                    {questionIndex + 1}
                  </Badge>
                  <p className="font-semibold text-lg flex-1 text-slate-900 dark:text-slate-100 leading-relaxed">{question.question}</p>
                </div>
                
                {question.options && question.options.length > 0 ? (
                  <div className="space-y-3 ml-11">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selectedQuizAnswers[questionIndex] === optionIndex;
                      const isCorrect = Number(optionIndex) === Number(question.correctAnswer);
                      const showAnswer = showQuizResults;
                      
                      return (
                        <label
                          key={optionIndex}
                          className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                            showAnswer && isCorrect
                              ? 'bg-green-100 dark:bg-green-900/40 border-2 border-green-500 shadow-md'
                              : showAnswer && isSelected && !isCorrect
                              ? 'bg-red-100 dark:bg-red-900/40 border-2 border-red-500 shadow-md'
                              : isSelected
                              ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 shadow-md'
                              : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz-${questionIndex}`}
                            value={optionIndex}
                            checked={selectedQuizAnswers[questionIndex] === optionIndex}
                            onChange={() => {
                              setSelectedQuizAnswers({
                                ...selectedQuizAnswers,
                                [questionIndex]: optionIndex,
                              });
                            }}
                            disabled={showQuizResults}
                            className="cursor-pointer w-5 h-5 text-blue-600"
                          />
                          <span className="flex-1 text-slate-700 dark:text-slate-300 font-medium">{option}</span>
                          {showAnswer && isCorrect && (
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="ml-11">
                    <input
                      type="text"
                      value={selectedQuizAnswers[questionIndex] || ''}
                      onChange={(e) => {
                        setSelectedQuizAnswers({
                          ...selectedQuizAnswers,
                          [questionIndex]: e.target.value,
                        });
                      }}
                      disabled={showQuizResults}
                      placeholder="Type your answer here..."
                      className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}
                
                {showQuizResults && question.explanation && (
                  <div className="mt-4 ml-11 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Explanation:</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{question.explanation}</p>
                  </div>
                )}
              </div>
            ))}
            
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleQuizSubmit}
                disabled={showQuizResults || isSubmittingQuiz}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingQuiz ? 'Submitting...' : 'Submit Quiz'}
              </Button>
              {showQuizResults && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowQuizResults(false);
                    setSelectedQuizAnswers({});
                  }}
                  className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-lg py-6 px-6"
                >
                  Retake Quiz
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Takeaways */}
      <Card className="border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-b border-purple-200 dark:border-purple-800">
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            Key Takeaways
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-3 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-purple-200 dark:border-purple-800">
              <span className="text-purple-600 dark:text-purple-400 font-bold text-xl mt-0.5">•</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Understand the core concepts presented in this lesson</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-purple-200 dark:border-purple-800">
              <span className="text-purple-600 dark:text-purple-400 font-bold text-xl mt-0.5">•</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Apply the knowledge to practical scenarios</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-purple-200 dark:border-purple-800">
              <span className="text-purple-600 dark:text-purple-400 font-bold text-xl mt-0.5">•</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Review the material and complete any exercises</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-purple-200 dark:border-purple-800">
              <span className="text-purple-600 dark:text-purple-400 font-bold text-xl mt-0.5">•</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Move on to the next lesson when ready</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Complete Lesson Button */}
      {!lesson.isCompleted && onComplete && (
        <Card className={`border-2 ${hasQuiz && !quizPassed ? 'border-orange-300 dark:border-orange-700 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30' : 'border-green-300 dark:border-green-700 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30'} shadow-lg`}>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <h3 className="font-bold text-2xl mb-2 text-slate-900 dark:text-slate-100">
                  {hasQuiz && !quizPassed ? 'Complete Quiz to Continue' : 'Ready to continue?'}
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  {hasQuiz && !quizPassed ? (
                    <span className="flex items-center gap-2 flex-wrap">
                      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      You must pass the quiz ({minPassingScore}% or higher) before completing this lesson.
                      {quizScore !== null && (
                        <span className="ml-2 font-semibold text-orange-600 dark:text-orange-400">
                          Your score: {quizScore}%
                        </span>
                      )}
                    </span>
                  ) : (
                    'Mark this lesson as complete to earn XP and unlock the next lesson!'
                  )}
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={handleCompleteLesson}
                disabled={hasQuiz && !quizPassed}
                className={`${hasQuiz && !quizPassed ? 'bg-orange-600 hover:bg-orange-700 cursor-not-allowed opacity-60' : 'bg-green-600 hover:bg-green-700'} text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {hasQuiz && !quizPassed ? 'Quiz Required' : 'Mark Complete'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

