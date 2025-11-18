/**
 * Admin Topic View - Allows admins to view individual topics and their detailed content
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ArrowLeft, 
  BookOpen, 
  Video, 
  FileText, 
  FlaskConical,
  ClipboardList,
  HelpCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { apiClient } from '@/integrations/api/client';

interface Topic {
  title: string;
  summary: string;
  detailedSummary?: string;
  materials?: {
    videos?: Array<{ title: string; url: string }>;
    textbooks?: Array<{ title: string; url: string }>;
    labs?: Array<{ title: string; url: string }>;
  };
  assignments?: Array<{
    title: string;
    description: string;
    tasks: string[];
  }>;
  quiz?: {
    questions: Array<{
      question: string;
      type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
      options?: string[];
      correctAnswer: number | string | boolean;
      explanation: string;
    }>;
  };
}

export default function AdminTopicView() {
  const { courseId, topicIndex } = useParams<{ courseId: string; topicIndex: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<any>(null);
  const [topic, setTopic] = useState<Topic | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Admin access required');
      navigate('/dashboard');
      return;
    }

    if (courseId && topicIndex) {
      fetchTopicData();
    }
  }, [courseId, topicIndex, user]);

  const fetchTopicData = async () => {
    try {
      setLoading(true);
      
      // Fetch course data
      const courseResponse = await apiClient.getCourse(courseId!);
      const course = courseResponse.data;
      setCourseData(course);

      // Get the specific topic from lessons
      const lessonIndex = parseInt(topicIndex || '0');
      const lesson = course.lessons?.[lessonIndex];
      
      if (lesson) {
        // Transform lesson to topic format
        const topicData: Topic = {
          title: lesson.title,
          summary: lesson.description || '',
          detailedSummary: lesson.content || '',
          materials: {
            videos: lesson.videoUrl ? [{ title: lesson.title, url: lesson.videoUrl }] : [],
            textbooks: lesson.resources?.filter((r: string) => 
              r.toLowerCase().includes('textbook') || 
              r.toLowerCase().includes('book') || 
              r.toLowerCase().includes('pdf')
            ).map((r: string) => ({ title: r, url: '#' })) || [],
            labs: lesson.resources?.filter((r: string) => 
              r.toLowerCase().includes('lab') || 
              r.toLowerCase().includes('practice') || 
              r.toLowerCase().includes('exercise')
            ).map((r: string) => ({ title: r, url: '#' })) || []
          },
          quiz: lesson.quiz
        };
        
        setTopic(topicData);
      }
    } catch (error: any) {
      console.error('Error fetching topic:', error);
      toast.error('Failed to load topic');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Topic not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{topic.title}</h1>
            <p className="text-muted-foreground">
              {courseData?.course?.title} - Admin View
            </p>
          </div>
        </div>
        <Badge variant="outline">Admin Access</Badge>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{topic.summary}</p>
            </CardContent>
          </Card>

          {topic.detailedSummary && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none whitespace-pre-wrap">
                  {topic.detailedSummary.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          {topic.materials?.videos && topic.materials.videos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topic.materials.videos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{video.title}</p>
                        <a 
                          href={video.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {video.url}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {topic.materials?.textbooks && topic.materials.textbooks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Textbooks & Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topic.materials.textbooks.map((textbook, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{textbook.title}</p>
                        <a 
                          href={textbook.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {textbook.url}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {topic.materials?.labs && topic.materials.labs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  Labs & Exercises
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topic.materials.labs.map((lab, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{lab.title}</p>
                        <a 
                          href={lab.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {lab.url}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          {topic.assignments && topic.assignments.length > 0 ? (
            topic.assignments.map((assignment, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    {assignment.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{assignment.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Tasks:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {assignment.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="text-muted-foreground">{task}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No assignments available for this topic.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz" className="space-y-4">
          {topic.quiz && topic.quiz.questions && topic.quiz.questions.length > 0 ? (
            <div className="space-y-4">
              {topic.quiz.questions.map((question, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <HelpCircle className="h-5 w-5" />
                      Question {index + 1}
                      <Badge variant="outline" className="ml-auto">
                        {question.type.replace('-', ' ')}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-medium">{question.question}</p>
                    
                    {question.type === 'multiple-choice' && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div 
                            key={optIndex}
                            className={`p-3 border rounded-lg ${
                              optIndex === question.correctAnswer 
                                ? 'bg-green-50 border-green-500 dark:bg-green-950' 
                                : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {optIndex === question.correctAnswer && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                              <span>{String.fromCharCode(65 + optIndex)}. {option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type === 'true-false' && (
                      <div className="space-y-2">
                        <div 
                          className={`p-3 border rounded-lg ${
                            question.correctAnswer === true 
                              ? 'bg-green-50 border-green-500 dark:bg-green-950' 
                              : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {question.correctAnswer === true && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            <span>True</span>
                          </div>
                        </div>
                        <div 
                          className={`p-3 border rounded-lg ${
                            question.correctAnswer === false 
                              ? 'bg-green-50 border-green-500 dark:bg-green-950' 
                              : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {question.correctAnswer === false && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            <span>False</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {question.type === 'fill-in-the-blank' && (
                      <div className="p-3 border rounded-lg bg-green-50 border-green-500 dark:bg-green-950">
                        <p className="font-medium">Correct Answer: {String(question.correctAnswer)}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Explanation:</p>
                      <p className="text-sm text-muted-foreground">{question.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No quiz available for this topic.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}



