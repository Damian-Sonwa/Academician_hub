/**
 * Weekly Course View - Sequential learning with weekly progression
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Lock, 
  CheckCircle, 
  Clock,
  Video,
  BookOpen,
  FlaskConical,
  ClipboardList,
  HelpCircle,
  Play,
  FileText
} from 'lucide-react';
import { apiClient } from '@/integrations/api/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import WeeklyQuiz from '@/components/WeeklyQuiz';

interface Week {
  week: number;
  topic: string;
  status: 'locked' | 'unlocked' | 'in-progress' | 'completed';
  assignmentsCompleted: number;
  totalAssignments: number;
  quizzesCompleted: number;
  totalQuizzes: number;
  completedAt: string | null;
}

interface WeekContent {
  week: number;
  topic: string;
  summary: string;
  why_it_matters: string;
  materials: {
    videos: Array<{ title: string; url: string }>;
    textbooks: Array<{ title: string; url: string }>;
    labs: Array<{ title: string; url: string }>;
  };
  assignments: Array<{
    title: string;
    description: string;
    tasks: string[];
  }>;
  quizzes: Array<{
    question: string;
    options?: string[];
    answer: string | number | boolean;
    type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
    explanation?: string;
  }>;
  progress: {
    status: string;
    assignmentsCompleted: number;
    totalAssignments: number;
    quizzesCompleted: number;
    totalQuizzes: number;
  };
}

export default function WeeklyCourseView() {
  const { courseId, level } = useParams<{ courseId: string; level: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [weekContent, setWeekContent] = useState<WeekContent | null>(null);
  const [showWeekDialog, setShowWeekDialog] = useState(false);
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [showQuizDialog, setShowQuizDialog] = useState(false);

  useEffect(() => {
    if (courseId && level) {
      fetchWeeks();
      fetchCourseInfo();
    }
  }, [courseId, level]);

  const fetchCourseInfo = async () => {
    try {
      const response = await apiClient.getCourse(courseId!);
      setCourseInfo(response.data.course);
    } catch (error: any) {
      console.error('Error fetching course:', error);
    }
  };

  const fetchWeeks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getWeeklyContent(courseId!, level!);
      setWeeks(response.data.weeks);
    } catch (error: any) {
      console.error('Error fetching weeks:', error);
      toast.error('Failed to load weekly content');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeekContent = async (weekNumber: number) => {
    try {
      const response = await apiClient.getWeekContent(courseId!, level!, weekNumber);
      setWeekContent(response.data);
      setSelectedWeek(weekNumber);
      setShowWeekDialog(true);
    } catch (error: any) {
      // Backend handles admin access, so this error should only occur for non-admins
      if (error.message.includes('Previous week must be completed')) {
        toast.error('Please complete the previous week first');
      } else {
        console.error('Error fetching week content:', error);
        toast.error('Failed to load week content');
      }
    }
  };

  const handleCompleteAssignment = async (assignmentIndex: number) => {
    if (!selectedWeek) return;

    try {
      const response = await apiClient.completeAssignment(
        courseId!,
        level!,
        selectedWeek,
        assignmentIndex
      );

      if (response.data.weekCompleted) {
        toast.success('🎉 Week completed! Next week unlocked.');
        fetchWeeks(); // Refresh weeks to update status
      } else {
        toast.success('Assignment completed!');
      }

      // Refresh week content
      if (selectedWeek) {
        fetchWeekContent(selectedWeek);
      }
    } catch (error: any) {
      console.error('Error completing assignment:', error);
      toast.error('Failed to complete assignment');
    }
  };

  const handleCompleteQuiz = async (quizIndex: number, answers: any[], score: number) => {
    if (!selectedWeek) return;

    try {
      const response = await apiClient.completeQuiz(
        courseId!,
        level!,
        selectedWeek,
        quizIndex,
        answers,
        score
      );

      if (response.data.weekCompleted) {
        toast.success('🎉 Week completed! Next week unlocked.');
        fetchWeeks(); // Refresh weeks to update status
      } else {
        toast.success(`Quiz completed! Score: ${score}%`);
      }

      // Refresh week content
      if (selectedWeek) {
        fetchWeekContent(selectedWeek);
      }
    } catch (error: any) {
      console.error('Error completing quiz:', error);
      toast.error('Failed to complete quiz');
    }
  };

  const getStatusBadge = (status: string) => {
    // Admins see all weeks as available
    if (user?.role === 'admin' && status === 'locked') {
      return <Badge className="bg-purple-500">Admin Access</Badge>;
    }
    
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'unlocked':
        return <Badge className="bg-gray-500">Available</Badge>;
      case 'locked':
        return <Badge variant="outline" className="border-gray-400">Locked</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            <h1 className="text-3xl font-bold">{courseInfo?.title || 'Weekly Course'}</h1>
            <p className="text-muted-foreground">Level: {level}</p>
          </div>
        </div>
      </div>

      {/* Weeks List */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeks.map((week) => (
              <Card
                key={week.week}
                className={`cursor-pointer transition-all ${
                  week.status === 'locked' && user?.role !== 'admin'
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:shadow-md'
                }`}
                onClick={() => (week.status !== 'locked' || user?.role === 'admin') && fetchWeekContent(week.week)}
              >
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {week.status === 'locked' && user?.role !== 'admin' ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : week.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Play className="h-5 w-5 text-primary" />
                        )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">Week {week.week}: {week.topic}</h3>
                          {getStatusBadge(week.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            Assignments: {week.assignmentsCompleted}/{week.totalAssignments}
                          </span>
                          <span>
                            Quizzes: {week.quizzesCompleted}/{week.totalQuizzes}
                          </span>
                        </div>
                        {(week.assignmentsCompleted > 0 || week.quizzesCompleted > 0) && (
                          <Progress
                            value={
                              ((week.assignmentsCompleted + week.quizzesCompleted) /
                                (week.totalAssignments + week.totalQuizzes)) *
                              100
                            }
                            className="mt-2"
                          />
                        )}
                      </div>
                    </div>
                    {(week.status !== 'locked' || user?.role === 'admin') && (
                      <Button variant="outline" size="sm">
                        Open
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Week Content Dialog */}
      {weekContent && (
        <Dialog open={showWeekDialog} onOpenChange={setShowWeekDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Week {weekContent.week}: {weekContent.topic}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="overview" className="mt-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Why It Matters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{weekContent.why_it_matters}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none whitespace-pre-wrap">
                      {weekContent.summary.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Materials Tab */}
              <TabsContent value="materials" className="space-y-4">
                {weekContent.materials.videos.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Videos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {weekContent.materials.videos.map((video, index) => (
                          <a
                            key={index}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 border rounded-lg hover:bg-muted"
                          >
                            <p className="font-medium">{video.title}</p>
                            <p className="text-sm text-muted-foreground">{video.url}</p>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {weekContent.materials.textbooks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Textbooks & Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {weekContent.materials.textbooks.map((textbook, index) => (
                          <a
                            key={index}
                            href={textbook.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 border rounded-lg hover:bg-muted"
                          >
                            <p className="font-medium">{textbook.title}</p>
                            <p className="text-sm text-muted-foreground">{textbook.url}</p>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {weekContent.materials.labs.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="h-5 w-5" />
                        Labs & Exercises
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {weekContent.materials.labs.map((lab, index) => (
                          <a
                            key={index}
                            href={lab.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 border rounded-lg hover:bg-muted"
                          >
                            <p className="font-medium">{lab.title}</p>
                            <p className="text-sm text-muted-foreground">{lab.url}</p>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Assignments Tab */}
              <TabsContent value="assignments" className="space-y-4">
                {weekContent.assignments.map((assignment, index) => {
                  const isCompleted = index < weekContent.progress.assignmentsCompleted;
                  
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5" />
                            {assignment.title}
                          </CardTitle>
                          {isCompleted && (
                            <Badge className="bg-green-500">Completed</Badge>
                          )}
                        </div>
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
                        {!isCompleted && (
                          <Button
                            onClick={() => handleCompleteAssignment(index)}
                            className="w-full"
                          >
                            Mark as Completed
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              {/* Quizzes Tab */}
              <TabsContent value="quizzes" className="space-y-4">
                {weekContent.quizzes.length > 0 ? (
                  weekContent.quizzes.map((quiz, index) => {
                    const isCompleted = index < weekContent.progress.quizzesCompleted;
                    
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <HelpCircle className="h-5 w-5" />
                              Quiz {index + 1}
                            </CardTitle>
                            {isCompleted && (
                              <Badge className="bg-green-500">Completed</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="font-medium mb-4">{quiz.question}</p>
                          {!isCompleted && (
                            <Button
                              onClick={() => {
                                setSelectedQuizIndex(index);
                                setShowQuizDialog(true);
                              }}
                              className="w-full"
                            >
                              Take Quiz
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No quizzes available for this week.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Quiz Dialog */}
      {weekContent && selectedQuizIndex !== null && weekContent.quizzes.length > 0 && (
        <Dialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Quiz: {weekContent.topic}</DialogTitle>
            </DialogHeader>
            <WeeklyQuiz
              questions={weekContent.quizzes}
              onComplete={(answers, score) => {
                handleCompleteQuiz(selectedQuizIndex, answers, score);
                setShowQuizDialog(false);
                setSelectedQuizIndex(null);
              }}
              onClose={() => {
                setShowQuizDialog(false);
                setSelectedQuizIndex(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

