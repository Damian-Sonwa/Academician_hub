import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LanguageBasicsViewer from '@/components/LanguageBasicsViewer';
import GenericLessonViewer from '@/components/GenericLessonViewer';
import GreetingsViewer from '@/components/GreetingsViewer';
import AssignmentViewer from '@/components/AssignmentViewer';
import { getSubjectImage } from '@/lib/utils';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Lock, 
  BookOpen, 
  Trophy,
  Clock,
  FileText,
  Video,
  ExternalLink,
  Download,
  BookMarked,
  GraduationCap,
  Lightbulb,
  Award,
  Target,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '@/integrations/api/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  content?: string; // Detailed lesson content
  duration: number;
  order: number;
  isCompleted: boolean;
  videoUrl?: string;
  imageUrl?: string; // Main lesson image
  images?: string[]; // Additional educational images
  resources: string[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: string;
  duration: string;
  enrolled: number;
  isPremium: boolean;
  imageUrl?: string;
  textbookTitle?: string;
  textbookUrl?: string;
  textbookLicense?: string;
  textbookAttribution?: string;
  textbookAuthor?: string;
  textbookSource?: string;
}

interface CourseData {
  course: Course;
  lessons: Lesson[];
  progress: {
    isEnrolled: boolean;
    completedLessons: number;
    totalLessons: number;
    completionPercentage: number;
    currentLesson?: string;
    xpEarned: number;
    lastAccessed?: Date;
  };
  assessments: {
    quiz: {
      id: string;
      title: string;
      type: string;
      duration: string;
      questions: number;
      available: boolean;
    };
    assignment: {
      id: string;
      title: string;
      type: string;
      dueDate: Date;
      available: boolean;
    };
  };
  learningObjectives: string[];
}

export default function CoursePage() {
  const { subject, level, id } = useParams<{ subject?: string; level?: string; id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedSummaries, setGeneratedSummaries] = useState<Record<string, any>>({});
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [greetingsData, setGreetingsData] = useState<any>(null);
  const [assignmentData, setAssignmentData] = useState<any>(null);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);

  useEffect(() => {
    if (id || (subject && level)) {
      fetchCourseData();
    }
  }, [subject, level, id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (id) {
        // Fetch by ID (preferred method)
        response = await apiClient.getCourse(id);
      } else if (subject && level) {
        // Fallback to old method
        response = await apiClient.getCourseBySubjectAndLevel(subject, level);
      } else {
        throw new Error('No course identifier provided');
      }
      
      setCourseData(response.data);
    } catch (error: any) {
      console.error('Error fetching course:', error);
      setError(error.message || 'Course not found');
      toast.error('Course not found');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll');
      navigate('/auth');
      return;
    }

    // Check if already enrolled before making API call
    if (progress.isEnrolled) {
      toast.info("You're already enrolled in this course!", {
        description: "Continue your learning journey from where you left off.",
      });
      return;
    }

    try {
      setEnrolling(true);
      const response = await apiClient.enrollInCourse(subject!, level!);
      toast.success(response.message || 'Successfully enrolled!');
      await fetchCourseData(); // Refresh to show enrolled status
    } catch (error: any) {
      // Check if error is due to already being enrolled
      if (error.message?.includes('Already enrolled') || error.message?.includes('already enrolled')) {
        toast.info("You're already enrolled in this course!", {
          description: "Continue your learning journey from where you left off.",
        });
        await fetchCourseData(); // Refresh to show enrolled status
      } else {
        toast.error(error.message || 'Failed to enroll in course');
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleOpenTextbook = () => {
    if (courseData?.course?.textbookUrl) {
      window.open(courseData.course.textbookUrl, '_blank', 'noopener,noreferrer');
      toast.success('Opening textbook in new tab');
    } else {
      toast.error('Textbook not available');
    }
  };

  const handleStartLesson = async (lesson: Lesson) => {
    // Open the lesson dialog immediately - no enrollment required
    setSelectedLesson(lesson);
    setShowLessonDialog(true);
    toast.success(`🎓 Opening: ${lesson.title}`);
    
    // If it's a greetings lesson, load greetings data
    if (isLanguageGreetingsLesson(lesson) && courseData?.course) {
      const language = getLanguageFromTitle(courseData.course.title);
      await loadGreetingsData(language);
    }
    
    // Update progress
    try {
      await apiClient.updateProgress({
        courseId: courseData.course._id,
        lessonId: lesson._id,
        completed: false,
      });
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  // Helper function to detect if this is a language alphabet/basics lesson
  const isLanguageBasicsLesson = (lesson: Lesson) => {
    const courseCategory = courseData?.course?.category?.toLowerCase() || subject?.toLowerCase() || '';
    const courseLevel = courseData?.course?.level?.toLowerCase() || level?.toLowerCase() || '';
    
    // For Languages category at Junior level, Lesson 1 should show alphabets
    return (
      lesson.order === 1 && 
      courseCategory === 'languages' &&
      courseLevel === 'junior'
    );
  };

  // Helper function to detect if this is a language greetings lesson
  const isLanguageGreetingsLesson = (lesson: Lesson) => {
    const courseCategory = courseData?.course?.category?.toLowerCase() || subject?.toLowerCase() || '';
    
    // For Languages category, Lesson 2 should show greetings
    return (
      lesson.order === 2 && 
      courseCategory === 'languages'
    );
  };

  // Helper function to detect which language from course title
  const getLanguageFromTitle = (courseTitle: string): string => {
    const title = courseTitle.toLowerCase();
    if (title.includes('spanish')) return 'spanish';
    if (title.includes('french')) return 'french';
    if (title.includes('german')) return 'german';
    if (title.includes('english')) return 'english';
    if (title.includes('mandarin') || title.includes('chinese')) return 'chinese';
    if (title.includes('italian')) return 'italian';
    if (title.includes('japanese')) return 'japanese';
    if (title.includes('korean')) return 'korean';
    if (title.includes('portuguese')) return 'portuguese';
    if (title.includes('arabic')) return 'arabic';
    
    console.warn('Could not detect language from title:', courseTitle);
    return 'english'; // default fallback
  };

  // Function to load greetings data
  const loadGreetingsData = async (language: string) => {
    try {
      const response = await apiClient.getGreetingsData(language);
      if (response.data) {
        setGreetingsData(response.data);
      }
    } catch (error: any) {
      console.error('Error loading greetings data:', error);
      toast.error('Failed to load greetings data');
    }
  };

  const handleCompleteLesson = async (lesson: Lesson) => {
    // Allow completing lessons without enrollment requirement
    try {
      await apiClient.completeLesson(courseData.course._id, lesson._id);
      toast.success(`✅ Completed: ${lesson.title}! +50 XP`);
      
      // Refresh course data to update lesson status
      await fetchCourseData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark lesson as complete');
    }
  };

  const handleGenerateSummary = async (lessonId: string) => {
    try {
      toast.info('🤖 Generating AI summary...', {
        description: 'This may take a few seconds',
      });

      const response: any = await apiClient.generateLessonSummary(lessonId);
      
      if (response?.data) {
        const summary = response.data;
        
        // Show generated content in a toast with details
        toast.success('✨ AI Summary Generated!', {
          description: `${summary.keyPoints?.length || 0} key points identified`,
          duration: 5000,
        });

        // Store generated summary in state to display
        setGeneratedSummaries(prev => ({
          ...prev,
          [lessonId]: summary,
        }));
      }
    } catch (error: any) {
      toast.error('Failed to generate summary', {
        description: error.message || 'Please try again later',
      });
    }
  };

  const handleOpenAssignment = async (lesson: Lesson) => {
    try {
      setLoading(true);
      const response = await apiClient.getAssignmentForLesson(lesson._id);
      if (response.data) {
        setAssignmentData(response.data.assignment);
        setShowAssignmentDialog(true);
        toast.info(`📝 Opening assignment for: ${lesson.title}`);
      } else {
        toast.error('No assignment found for this lesson.');
      }
    } catch (error: any) {
      console.error('Error fetching assignment:', error);
      toast.error(error.message || 'Failed to load assignment.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async (answers: any[], timeSpent: number) => {
    if (!assignmentData) return;
    
    try {
      setLoading(true);
      const response = await apiClient.submitAssignment(assignmentData._id, answers, timeSpent);
      
      if (response.data) {
        toast.success(`🎉 Assignment submitted! You scored ${response.data.score?.toFixed(0) || 0}%`);
        setShowAssignmentDialog(false);
        await fetchCourseData(); // Refresh course data
      } else {
        toast.error('Failed to submit assignment');
      }
    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      toast.error(error.message || 'Failed to submit assignment');
    } finally {
      setLoading(false);
    }
  };

  const canAccessLesson = (lesson: Lesson, index: number): boolean => {
    // Admins have access to all lessons
    if (user?.role === 'admin') {
      return true;
    }
    // First lesson is always accessible
    if (index === 0) return true;
    
    // Can access if previous lesson is completed
    const previousLesson = courseData?.lessons[index - 1];
    return previousLesson?.isCompleted || false;
  };

  const handleTakeQuiz = () => {
    // Navigate to first lesson for quiz access
    const lessons = courseData?.lessons || [];
    if (lessons.length > 0) {
      handleStartLesson(lessons[0]);
    }
  };

  const handleViewAssignment = () => {
    // Find first completed lesson with assignment
    const lessons = courseData?.lessons || [];
    const completedLessons = lessons.filter(l => l.isCompleted);
    
    if (completedLessons.length > 0) {
      handleOpenAssignment(completedLessons[0]);
    } else {
      toast.info('📝 Complete a lesson first, then return here to take its assignment!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-6">
        <Card className="max-w-md w-full border-destructive/50">
          <CardHeader>
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-8 w-8" />
              <CardTitle className="text-2xl">Course Not Found</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {error || 'The course you are looking for could not be found.'}
            </p>
            <Button 
              onClick={() => navigate('/courses')}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </CardContent>
      </Card>
      </div>
    );
  }

  const { 
    course, 
    lessons = [], 
    progress = { isEnrolled: false, completedLessons: 0, totalLessons: 0, completionPercentage: 0, xpEarned: 0 }, 
    assessments, 
    learningObjectives = [] 
  } = courseData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/courses')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Button>
          <div className="flex-1" />
          {progress.isEnrolled && (
            <Badge variant="default" className="gap-2 px-4 py-2 text-base">
              <CheckCircle className="h-4 w-4" />
              Enrolled
            </Badge>
          )}
        </div>

      {/* Course Header */}
        <Card className="border-2 bg-gradient-to-br from-card to-secondary/20">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Course Image */}
              <div className="lg:w-1/3">
                <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20 aspect-video flex items-center justify-center">
                  {(() => {
                    const imageUrl = getSubjectImage(course);
                    return imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <GraduationCap className="h-24 w-24 text-primary/40" />
                    );
                  })()}
                  <div className="absolute top-2 right-2 flex gap-2">
                    {course.isPremium && (
                      <Badge className="bg-amber-500 text-white">
                        Premium
                      </Badge>
                    )}
                    {user?.role === 'admin' && (
                      <Badge className="bg-primary text-white">
                        Admin Access
                      </Badge>
                    )}
                  </div>
            </div>
          </div>

              {/* Course Info */}
              <div className="lg:w-2/3 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant={course.level === 'Beginner' ? 'default' : course.level === 'Advanced' ? 'destructive' : 'secondary'}>
                  {course.level}
                </Badge>
              </div>
                  <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
              <p className="text-muted-foreground text-lg">{course.description}</p>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-secondary/30 rounded-lg p-3">
              <div className="text-sm text-muted-foreground mb-1">Instructor</div>
              <div className="font-semibold">{course.instructor}</div>
            </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
              <div className="text-sm text-muted-foreground mb-1">Duration</div>
              <div className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {course.duration}
              </div>
            </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <div className="text-sm text-muted-foreground mb-1">Lessons</div>
                    <div className="font-semibold">{progress.totalLessons}</div>
            </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
              <div className="text-sm text-muted-foreground mb-1">Students</div>
              <div className="font-semibold">{course.enrolled}</div>
            </div>
          </div>

          {/* Progress Bar (if enrolled) */}
          {progress.isEnrolled && (
                  <div className="bg-secondary/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Your Progress</span>
                <span className="text-sm text-muted-foreground">
                  {progress.completedLessons} / {progress.totalLessons} lessons
                </span>
              </div>
                    <Progress value={progress.completionPercentage} className="h-2" />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {progress.completionPercentage}% Complete
                </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {progress.xpEarned} XP
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                const levelParam = level?.toLowerCase() || 
                  (course.level === 'Junior' ? 'beginner' : 
                   course.level === 'Secondary' ? 'intermediate' : 'advanced');
                navigate(`/course/${course._id}/weekly/${levelParam}`);
              }}
              className="flex-1"
              size="lg"
            >
              <FileText className="mr-2 h-5 w-5" />
              Weekly View
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const nextLesson = lessons.find(l => !l.isCompleted);
                if (nextLesson) {
                  handleStartLesson(nextLesson);
                } else {
                  toast.success('Course completed! 🎉');
                }
              }}
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              {progress.completionPercentage === 100 ? 'Review Course' : 'Start Learning'}
            </Button>
          </div>
              </div>
            </div>
          </CardHeader>
                </Card>

        {/* Textbook Section */}
        {course.textbookUrl && (
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                          <BookMarked className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{course.textbookTitle || 'Course Textbook'}</CardTitle>
                  {course.textbookAuthor && (
                    <p className="text-sm text-muted-foreground mb-3">
                      <span className="font-semibold">Author:</span> {course.textbookAuthor}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">
                              {course.textbookLicense || 'Open Access'}
                            </Badge>
                    <Badge variant="secondary">Free & Open</Badge>
                    {course.textbookSource && (
                      <Badge className="bg-green-600 hover:bg-green-700">
                        {course.textbookSource}
                            </Badge>
                    )}
                          </div>
                  {course.textbookAttribution && (
                    <p className="text-sm text-muted-foreground mb-4">
                            {course.textbookAttribution}
                          </p>
                  )}
                  
                  <div className="flex gap-3">
                          <Button 
                      variant="default"
                      onClick={handleOpenTextbook}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Textbook
                          </Button>
                          <Button 
                            variant="outline"
                      onClick={handleOpenTextbook}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Open in New Tab
                          </Button>
                        </div>
                      </div>
                      </div>
            </CardHeader>
                </Card>
              )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="lessons" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="lessons" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="assessments" className="gap-2">
              <FileText className="h-4 w-4" />
              Assessments
            </TabsTrigger>
            <TabsTrigger value="overview" className="gap-2">
              <Target className="h-4 w-4" />
              Overview
            </TabsTrigger>
          </TabsList>

            {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lessons.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No lessons available yet
                  </p>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {lessons.map((lesson, index) => {
                      const isLocked = !canAccessLesson(lesson, index);
                      
                      return (
                        <AccordionItem 
                  key={lesson._id} 
                          value={`lesson-${index}`}
                          disabled={user?.role !== 'admin' && isLocked}
                        >
                          <AccordionTrigger 
                            className={`hover:no-underline ${(isLocked && user?.role !== 'admin') ? 'opacity-60 cursor-not-allowed' : ''}`}
                            disabled={user?.role !== 'admin' && isLocked}
                          >
                            <div className="flex items-center gap-3 w-full pr-4">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        lesson.isCompleted 
                                  ? 'bg-green-500 text-white' 
                                  : isLocked
                                    ? 'bg-muted text-muted-foreground'
                          : progress.isEnrolled 
                                      ? 'bg-primary/20 text-primary' 
                                      : 'bg-muted text-muted-foreground'
                      }`}>
                        {lesson.isCompleted ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : isLocked ? (
                                  <Lock className="h-4 w-4" />
                        ) : progress.isEnrolled ? (
                                  <Play className="h-4 w-4" />
                                ) : (
                                  <Lock className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex-1 text-left">
                                <div className="font-semibold flex items-center gap-2">
                                  {lesson.title}
                                  {isLocked && progress.isEnrolled && user?.role !== 'admin' && (
                                    <Badge variant="outline" className="text-xs">
                                      Complete Previous First
                                    </Badge>
                                  )}
                                  {user?.role === 'admin' && (
                                    <Badge className="bg-purple-500 text-xs">
                                      Admin Access
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration} mins
                                  {lesson.videoUrl && (
                                    <>
                                      <Video className="h-3 w-3 ml-2" />
                                      Video
                                    </>
                        )}
                      </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-11 pr-4 space-y-4">
                              {/* Lesson Image */}
                              {lesson.imageUrl && (
                                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                  <img 
                                    src={lesson.imageUrl} 
                                    alt={lesson.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}

                              {/* Lesson Description/Summary */}
                              <div className="bg-muted/50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">📚 Lesson Summary</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {lesson.description}
                            </p>
                              </div>

                              {/* Additional Images */}
                              {lesson.images && lesson.images.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                  {lesson.images.slice(0, 3).map((img, idx) => (
                                    <div key={idx} className="relative h-24 rounded-md overflow-hidden">
                                      <img 
                                        src={img} 
                                        alt={`Illustration ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Lesson Content Preview */}
                              {lesson.content && (
                                <div className="bg-background border rounded-lg p-4">
                                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    What You'll Learn
                                  </h4>
                                  <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                                    {lesson.content.substring(0, 300)}...
                                  </p>
                                </div>
                              )}
                              
                              {/* Resources */}
                              {lesson.resources && lesson.resources.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Learning Resources:
                                  </h4>
                                  <ul className="space-y-1">
                                    {lesson.resources.map((resource, idx) => (
                                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2 pl-6">
                                        <span className="text-primary">•</span>
                                        {resource}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* AI Generated Summary */}
                              {generatedSummaries[lesson._id] && (
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800 space-y-4">
                                  <div className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-blue-600" />
                                    <h4 className="font-bold text-blue-900 dark:text-blue-100">AI-Generated Summary</h4>
                                  </div>
                                  
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {generatedSummaries[lesson._id].summary}
                                  </p>

                                  {generatedSummaries[lesson._id].keyPoints?.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold text-sm mb-2">📌 Key Learning Points:</h5>
                                      <ul className="space-y-1">
                                        {generatedSummaries[lesson._id].keyPoints.map((point: string, idx: number) => (
                                          <li key={idx} className="text-sm flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5">•</span>
                                            <span>{point}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {generatedSummaries[lesson._id].learningObjectives?.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold text-sm mb-2">🎯 Learning Objectives:</h5>
                                      <ul className="space-y-1">
                                        {generatedSummaries[lesson._id].learningObjectives.map((obj: string, idx: number) => (
                                          <li key={idx} className="text-sm flex items-start gap-2">
                                            <span className="text-purple-600 mt-0.5">→</span>
                                            <span>{obj}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {generatedSummaries[lesson._id].images?.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold text-sm mb-2">🖼️ AI-Selected Images:</h5>
                                      <div className="grid grid-cols-2 gap-2">
                                        {generatedSummaries[lesson._id].images.map((img: any, idx: number) => (
                                          <div key={idx} className="relative rounded-md overflow-hidden">
                                            <img 
                                              src={img.url} 
                                              alt={img.description}
                                              className="w-full h-32 object-cover"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                                              <p className="text-xs text-white truncate">
                                                📸 {img.photographer}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>⏱️ Est. reading time: {generatedSummaries[lesson._id].estimatedReadingTime} min</span>
                                    <span>•</span>
                                    <span>🎓 Difficulty: {generatedSummaries[lesson._id].difficulty}</span>
                            </div>
                          </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex gap-2 flex-wrap pt-2">
                          <Button 
                                  onClick={() => handleStartLesson(lesson)}
                                  disabled={user?.role !== 'admin' && isLocked}
                            variant={lesson.isCompleted ? "outline" : "default"}
                                  className="flex-1 sm:flex-initial"
                          >
                            {lesson.isCompleted ? (
                              <>
                                      <Play className="h-4 w-4 mr-2" />
                                      Review Lesson
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                      Start Lesson
                              </>
                            )}
                          </Button>
                                
                                {!lesson.isCompleted && (user?.role === 'admin' || !isLocked) && (
                                  <Button
                                    onClick={() => handleCompleteLesson(lesson)}
                                    variant="default"
                                    className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark Complete
                                  </Button>
                                )}

                                {/* AI Generate Summary Button */}
                                <Button
                                  onClick={() => handleGenerateSummary(lesson._id)}
                                  variant="outline"
                                  className="flex-1 sm:flex-initial border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
                                  disabled={user?.role !== 'admin' && isLocked}
                                >
                                  <Lightbulb className="h-4 w-4 mr-2" />
                                  {generatedSummaries[lesson._id] ? 'Regenerate Summary' : 'Generate AI Summary'}
                          </Button>

                                {/* Take Assignment Button - Available after lesson is completed */}
                                {lesson.isCompleted && (
                                  <Button
                                    onClick={() => handleOpenAssignment(lesson)}
                                    variant="secondary"
                                    className="flex-1 sm:flex-initial border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950"
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Take Assignment
                                  </Button>
                                )}
                        </div>
                      </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
                  </CardContent>
                </Card>
            </TabsContent>

            {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Quiz Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-semibold">10-15</span>
              </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-semibold">20 mins</span>
                      </div>
                    </div>
                    <Button 
                    className="w-full"
                      onClick={handleTakeQuiz}
                    >
                          <Play className="h-4 w-4 mr-2" />
                          Take Quiz
                    </Button>
                </CardContent>
              </Card>

              {/* Assignment Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Available:</span>
                      <span className="font-semibold">All lessons</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="default">
                        Active
                      </Badge>
                        </div>
                    </div>
                    <Button 
                    className="w-full"
                      onClick={handleViewAssignment}
                    >
                        <FileText className="h-4 w-4 mr-2" />
                          View Assignments
                    </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

            {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Objectives
                </CardTitle>
                </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
                </CardContent>
              </Card>

            <Card>
                <CardHeader>
                <CardTitle>About This Course</CardTitle>
                </CardHeader>
              <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                  {course.description}
                </p>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Course Highlights</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm">{progress.totalLessons} Interactive Lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-primary" />
                      <span className="text-sm">Video Content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm">Quizzes & Assignments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-sm">Earn XP & Achievements</span>
                    </div>
                  </div>
                </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </div>

      {/* Lesson Content Dialog */}
      <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedLesson?.title || 'Lesson'}
            </DialogTitle>
          </DialogHeader>
          {selectedLesson && courseData && (
            <>
              {/* Check if Language Alphabet/Basics Lesson */}
              {isLanguageBasicsLesson(selectedLesson) ? (
                <LanguageBasicsViewer 
                  language={getLanguageFromTitle(courseData.course.title)}
                />
              ) : isLanguageGreetingsLesson(selectedLesson) && greetingsData ? (
                <GreetingsViewer 
                  language={courseData.course.title}
                  data={greetingsData}
                />
              ) : (
                <GenericLessonViewer
                  lesson={selectedLesson}
                  courseId={courseData.course._id}
                  onComplete={async () => {
                    await handleCompleteLesson(selectedLesson);
                    setShowLessonDialog(false);
                  }}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Assignment: {assignmentData?.title}</DialogTitle>
          </DialogHeader>
          {assignmentData && (
            <AssignmentViewer
              assignment={assignmentData}
              onSubmit={handleSubmitAssignment}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
