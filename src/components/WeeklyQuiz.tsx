/**
 * Weekly Quiz Component - Interactive quiz interface
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options?: string[];
  answer: string | number | boolean;
  type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
  explanation?: string;
}

interface WeeklyQuizProps {
  questions: QuizQuestion[];
  onComplete: (answers: any[], score: number) => void;
  onClose: () => void;
}

export default function WeeklyQuiz({ questions, onComplete, onClose }: WeeklyQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const question = questions[currentQuestion];

  const handleAnswer = (answer: any) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      let correct = 0;
      questions.forEach((q, index) => {
        const userAnswer = answers[index];
        if (q.type === 'multiple-choice') {
          if (userAnswer === q.answer) correct++;
        } else if (q.type === 'true-false') {
          if (userAnswer === q.answer) correct++;
        } else if (q.type === 'fill-in-the-blank') {
          if (String(userAnswer).toLowerCase().trim() === String(q.answer).toLowerCase().trim()) {
            correct++;
          }
        }
      });

      const calculatedScore = Math.round((correct / questions.length) * 100);
      setScore(calculatedScore);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const answerArray = questions.map((_, index) => answers[index] ?? null);
    onComplete(answerArray, score);
  };

  const getAnswerStatus = (questionIndex: number, optionIndex?: number) => {
    if (!showResults) return null;
    
    const q = questions[questionIndex];
    const userAnswer = answers[questionIndex];

    if (q.type === 'multiple-choice') {
      if (optionIndex === q.answer) return 'correct';
      if (optionIndex === userAnswer && optionIndex !== q.answer) return 'incorrect';
    } else if (q.type === 'true-false') {
      if (optionIndex === 0 && q.answer === true) return 'correct';
      if (optionIndex === 1 && q.answer === false) return 'correct';
      if (optionIndex === 0 && userAnswer === true && q.answer === false) return 'incorrect';
      if (optionIndex === 1 && userAnswer === false && q.answer === true) return 'incorrect';
    }

    return null;
  };

  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <p className="text-muted-foreground">
              You got {Math.round((score / 100) * questions.length)} out of {questions.length} questions correct
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((q, index) => {
              const userAnswer = answers[index];
              const isCorrect = 
                (q.type === 'multiple-choice' && userAnswer === q.answer) ||
                (q.type === 'true-false' && userAnswer === q.answer) ||
                (q.type === 'fill-in-the-blank' && 
                  String(userAnswer).toLowerCase().trim() === String(q.answer).toLowerCase().trim());

              return (
                <Card key={index} className={isCorrect ? 'border-green-500' : 'border-red-500'}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{q.question}</p>
                        {q.type === 'multiple-choice' && (
                          <div className="mt-2 space-y-1">
                            {q.options?.map((option, optIndex) => {
                              const status = getAnswerStatus(index, optIndex);
                              return (
                                <div
                                  key={optIndex}
                                  className={`p-2 rounded ${
                                    status === 'correct'
                                      ? 'bg-green-50 border border-green-500'
                                      : status === 'incorrect'
                                      ? 'bg-red-50 border border-red-500'
                                      : ''
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {q.type === 'true-false' && (
                          <div className="mt-2 space-y-1">
                            <div
                              className={`p-2 rounded ${
                                getAnswerStatus(index, 0) === 'correct'
                                  ? 'bg-green-50 border border-green-500'
                                  : getAnswerStatus(index, 0) === 'incorrect'
                                  ? 'bg-red-50 border border-red-500'
                                  : ''
                              }`}
                            >
                              True
                            </div>
                            <div
                              className={`p-2 rounded ${
                                getAnswerStatus(index, 1) === 'correct'
                                  ? 'bg-green-50 border border-green-500'
                                  : getAnswerStatus(index, 1) === 'incorrect'
                                  ? 'bg-red-50 border border-red-500'
                                  : ''
                              }`}
                            >
                              False
                            </div>
                          </div>
                        )}
                        {q.type === 'fill-in-the-blank' && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                              Your answer: <strong>{String(userAnswer || 'No answer')}</strong>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Correct answer: <strong>{String(q.answer)}</strong>
                            </p>
                          </div>
                        )}
                        {q.explanation && (
                          <div className="mt-2 p-2 bg-muted rounded">
                            <p className="text-sm">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Submit Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <Badge variant="outline">{question.type.replace('-', ' ')}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium text-lg">{question.question}</p>

        {question.type === 'multiple-choice' && question.options && (
          <RadioGroup
            value={String(answers[currentQuestion] ?? '')}
            onValueChange={(value) => handleAnswer(parseInt(value))}
            className="space-y-2"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted">
                <RadioGroupItem value={String(index)} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {String.fromCharCode(65 + index)}. {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === 'true-false' && (
          <RadioGroup
            value={String(answers[currentQuestion] ?? '')}
            onValueChange={(value) => handleAnswer(value === 'true')}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="flex-1 cursor-pointer">True</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="flex-1 cursor-pointer">False</Label>
            </div>
          </RadioGroup>
        )}

        {question.type === 'fill-in-the-blank' && (
          <Input
            value={answers[currentQuestion] ?? ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="w-full"
          />
        )}

        <div className="flex gap-2">
          {currentQuestion > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
            >
              Previous
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1"
            disabled={answers[currentQuestion] === undefined && questions[currentQuestion].type !== 'fill-in-the-blank'}
          >
            {currentQuestion < questions.length - 1 ? 'Next' : 'Finish Quiz'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

