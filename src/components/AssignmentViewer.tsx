import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Clock, Trophy, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/integrations/api/client';

interface AssignmentQuestion {
  _id?: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

interface AssignmentData {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'advanced';
  duration: number;
  totalPoints: number;
  passingScore: number;
  questions: AssignmentQuestion[];
  instructions: string[];
}

interface AssignmentViewerProps {
  assignment: AssignmentData;
  submission?: any;
  onSubmit: (answers: any[], timeSpent: number) => Promise<void>;
}

export default function AssignmentViewer({ assignment, submission, onSubmit }: AssignmentViewerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [timeStarted] = useState(Date.now());

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    // Validate all questions answered
    if (Object.keys(answers).length < assignment.questions.length) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);

    try {
      const timeSpent = Math.round((Date.now() - timeStarted) / 60000); // minutes

      const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      await onSubmit(answersArray, timeSpent);
      toast.success('Assignment submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '😊';
      case 'medium':
        return '📚';
      case 'hard':
        return '🎯';
      case 'advanced':
        return '🏆';
      default:
        return '📝';
    }
  };

  if (submission) {
    // Show results if already submitted
    const percentage = submission.percentageScore;
    const isPassed = submission.isPassed;

    return (
      <div className="space-y-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-between">
              <span>Assignment Results</span>
              <Badge className={getDifficultyColor(assignment.difficulty)}>
                {getDifficultyIcon(assignment.difficulty)} {assignment.difficulty.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant={isPassed ? 'default' : 'destructive'}>
              {isPassed ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {isPassed ? 'Congratulations! You Passed!' : 'You Did Not Pass'}
              </AlertTitle>
              <AlertDescription>
                Score: {submission.totalScore} / {submission.totalPoints} ({percentage.toFixed(1)}%)
                <br />
                Required: {assignment.passingScore}%
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">
                    {submission.totalScore}
                  </div>
                  <div className="text-sm text-muted-foreground">Points Earned</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {assignment.questions.map((question, index) => {
          const userAnswer = submission.answers.find((a: any) => a.questionId === question._id);
          const isCorrect = userAnswer?.isCorrect;

          return (
            <Card key={index} className={isCorrect ? 'border-green-500' : 'border-red-500'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Question {index + 1} {isCorrect ? <CheckCircle className="text-green-600" /> : <AlertCircle className="text-red-600" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-medium">{question.question}</p>

                {question.type === 'multiple-choice' && (
                  <div className="space-y-2">
                    {question.options?.map((option: string) => (
                      <div
                        key={option}
                        className={`p-2 rounded ${
                          option === question.correctAnswer
                            ? 'bg-green-50 dark:bg-green-950/30'
                            : userAnswer?.answer === option && !isCorrect
                            ? 'bg-red-50 dark:bg-red-950/30'
                            : 'bg-gray-50 dark:bg-gray-900'
                        }`}
                      >
                        {option === question.correctAnswer ? '✅ ' : userAnswer?.answer === option && !isCorrect ? '❌ ' : ''}
                        {option}
                        {option === question.correctAnswer && ' (Correct Answer)'}
                        {userAnswer?.answer === option && !isCorrect && ' (Your Answer)'}
                      </div>
                    ))}
                  </div>
                )}

                {question.explanation && (
                  <Alert>
                    <BookOpen className="h-4 w-4" />
                    <AlertTitle>Explanation</AlertTitle>
                    <AlertDescription>{question.explanation}</AlertDescription>
                  </Alert>
                )}

                <div className="text-sm text-muted-foreground">
                  Points: {userAnswer?.pointsEarned || 0} / {question.points}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{assignment.title}</CardTitle>
              <p className="text-muted-foreground mt-2">{assignment.description}</p>
            </div>
            <Badge className={getDifficultyColor(assignment.difficulty)}>
              {getDifficultyIcon(assignment.difficulty)} {assignment.difficulty.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Duration: {assignment.duration} minutes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Passing Score: {assignment.passingScore}%
              </span>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Instructions</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                {assignment.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {assignment.questions.map((question, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">
              Question {index + 1} ({question.points} points)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-medium">{question.question}</p>

            {question.type === 'multiple-choice' && (
              <RadioGroup
                value={answers[question._id || index.toString()] || ''}
                onValueChange={(value) => handleAnswerChange(question._id || index.toString(), value)}
              >
                {question.options?.map((option: string) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${question._id}-${option}`} />
                    <Label htmlFor={`${question._id}-${option}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === 'short-answer' && (
              <div className="space-y-2">
                <Label htmlFor={`answer-${index}`}>Your Answer</Label>
                <Input
                  id={`answer-${index}`}
                  value={answers[question._id || index.toString()] || ''}
                  onChange={(e) => handleAnswerChange(question._id || index.toString(), e.target.value)}
                  placeholder="Type your answer here..."
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {Object.keys(answers).length} of {assignment.questions.length} questions answered
        </div>
        <Button
          onClick={handleSubmit}
          disabled={submitting || Object.keys(answers).length < assignment.questions.length}
          size="lg"
        >
          {submitting ? 'Submitting...' : 'Submit Assignment'}
        </Button>
      </div>
    </div>
  );
}

