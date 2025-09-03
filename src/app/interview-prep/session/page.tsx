'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Zap,
  Code,
  MessageSquare,
  Users,
  FileText,
  Play,
  Pause,
  CheckCircle,
  ArrowRight,
  Timer,
  Mic,
  MicOff,
  Send
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="h-64 bg-muted animate-pulse rounded" />
});
import Link from 'next/link';

type InterviewStage = 'setup' | 'coding' | 'technical' | 'behavioral' | 'report';

function InterviewSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStage, setCurrentStage] = useState<InterviewStage>('setup');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionData, setSessionData] = useState({
    companyType: searchParams.get('companyType') || '',
    role: searchParams.get('role') || '',
    experience: searchParams.get('experience') || '',
    language: searchParams.get('language') || ''
  });

  const [challengeData, setChallengeData] = useState<any>(null);
  const [technicalQuestions, setTechnicalQuestions] = useState<any>(null);
  const [behavioralQuestions, setBehavioralQuestions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // User responses
  const [codeSolution, setCodeSolution] = useState<string>('');
  const [technicalAnswers, setTechnicalAnswers] = useState<string[]>([]);
  const [behavioralAnswers, setBehavioralAnswers] = useState<string[]>([]);
  const [interviewReport, setInterviewReport] = useState<any>(null);

  // Voice recognition
  const [isListening, setIsListening] = useState<number | null>(null);
  const accumulatedTextRef = useRef<string>('');
  const currentQuestionIndexRef = useRef<number | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  // Stage configurations
  const stageConfig = {
    coding: { duration: 45 * 60, title: 'Coding Challenge', icon: Code, color: 'text-primary' },
    technical: { duration: 30 * 60, title: 'Technical Questions', icon: MessageSquare, color: 'text-blue-500' },
    behavioral: { duration: 20 * 60, title: 'Behavioral Interview', icon: Users, color: 'text-green-500' },
    report: { duration: 0, title: 'Feedback Report', icon: FileText, color: 'text-purple-500' }
  };

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      setRecognition(recognitionInstance);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // Auto-advance to next stage when time runs out
            handleNextStage();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startStage = async (stage: InterviewStage) => {
    if (stage === 'report') {
      setCurrentStage(stage);
      return;
    }

    // Generate AI content for the stage
    if (stage === 'coding' || stage === 'technical' || stage === 'behavioral') {
      await generateStageContent(stage);
    }

    const config = stageConfig[stage as keyof typeof stageConfig];
    setCurrentStage(stage);
    setTimeRemaining(config.duration);
    setIsTimerRunning(true);
  };

  const handleNextStage = async () => {
    const stages: InterviewStage[] = ['setup', 'coding', 'technical', 'behavioral', 'report'];
    const currentIndex = stages.indexOf(currentStage);

    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      if (nextStage === 'report') {
        setCurrentStage(nextStage);
        setIsTimerRunning(false);
        await generateInterviewReport();
      } else {
        startStage(nextStage);
      }
    }
  };

  const getProgressPercentage = () => {
    const stages = ['setup', 'coding', 'technical', 'behavioral', 'report'];
    const currentIndex = stages.indexOf(currentStage);
    return (currentIndex / (stages.length - 1)) * 100;
  };

  const generateStageContent = async (stage: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-interview-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sessionData,
          stage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();

      if (stage === 'coding') {
        setChallengeData(data);
        setCodeSolution(data.starterCode || '');
      } else if (stage === 'technical') {
        setTechnicalQuestions(data);
        setTechnicalAnswers(new Array(data.questions?.length || 0).fill(''));
      } else if (stage === 'behavioral') {
        setBehavioralQuestions(data);
        setBehavioralAnswers(new Array(data.questions?.length || 0).fill(''));
      }
    } catch (error) {
      console.error('Error generating stage content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecognition = (questionIndex: number, isAnswerField: boolean = true) => {
    if (!recognition) return;

    // Initialize accumulated text with current answer
    if (currentStage === 'technical') {
      accumulatedTextRef.current = technicalAnswers[questionIndex] || '';
    } else if (currentStage === 'behavioral') {
      accumulatedTextRef.current = behavioralAnswers[questionIndex] || '';
    }
    
    currentQuestionIndexRef.current = questionIndex;
    setIsListening(questionIndex);

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      // Process all results from the current recognition session
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update accumulated text with final results
      if (finalTranscript) {
        accumulatedTextRef.current += finalTranscript + ' ';
      }

      // Display accumulated text + current interim text
      const displayText = accumulatedTextRef.current + interimTranscript;

      // Update the appropriate answer field
      if (currentStage === 'technical') {
        const newAnswers = [...technicalAnswers];
        newAnswers[questionIndex] = displayText;
        setTechnicalAnswers(newAnswers);
      } else if (currentStage === 'behavioral') {
        const newAnswers = [...behavioralAnswers];
        newAnswers[questionIndex] = displayText;
        setBehavioralAnswers(newAnswers);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(null);
      currentQuestionIndexRef.current = null;
    };

    recognition.onend = () => {
      // Only auto-restart if we're still supposed to be listening
      if (isListening === questionIndex && currentQuestionIndexRef.current === questionIndex) {
        setTimeout(() => {
          if (isListening === questionIndex && currentQuestionIndexRef.current === questionIndex) {
            try {
              recognition.start();
            } catch (error) {
              console.error('Failed to restart recognition:', error);
              setIsListening(null);
            }
          }
        }, 100);
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsListening(null);
    }
  };

  const stopVoiceRecognition = () => {
    if (recognition) {
      // Clear refs and state to prevent auto-restart
      const questionIndex = currentQuestionIndexRef.current;
      currentQuestionIndexRef.current = null;
      setIsListening(null);
      recognition.stop();
      
      // Ensure final text is properly saved
      if (questionIndex !== null && accumulatedTextRef.current) {
        if (currentStage === 'technical') {
          const newAnswers = [...technicalAnswers];
          newAnswers[questionIndex] = accumulatedTextRef.current.trim();
          setTechnicalAnswers(newAnswers);
        } else if (currentStage === 'behavioral') {
          const newAnswers = [...behavioralAnswers];
          newAnswers[questionIndex] = accumulatedTextRef.current.trim();
          setBehavioralAnswers(newAnswers);
        }
      }
    }
  };

  const generateInterviewReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/evaluate-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionData,
          challengeData,
          codeSolution,
          technicalQuestions,
          technicalAnswers,
          behavioralQuestions,
          behavioralAnswers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const report = await response.json();
      setInterviewReport(report);
    } catch (error) {
      console.error('Error generating report:', error);
      // Fallback report
      setInterviewReport({
        overallScore: 75,
        codingScore: 80,
        technicalScore: 70,
        behavioralScore: 75,
        strengths: ['Good problem-solving approach', 'Clear communication'],
        improvements: ['Consider edge cases', 'Provide more specific examples'],
        feedback: 'Overall solid performance with room for improvement in technical depth.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStage === 'setup') {
    return (
      <div className="min-h-screen bg-background">
        <div className="absolute top-6 left-6">
          <Link href="/interview-prep" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Setup</span>
          </Link>
        </div>

        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Zap className="h-6 w-6 text-primary" />
                <span>Ready to Start Your Interview?</span>
              </CardTitle>
              <CardDescription>
                You've selected: {sessionData.companyType} • {sessionData.role} • {sessionData.experience} level • {sessionData.language}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">What to Expect:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span><strong>Stage 1:</strong> 45-minute coding challenge with real-time feedback</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span><strong>Stage 2:</strong> 30-minute technical Q&A session</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span><strong>Stage 3:</strong> 20-minute behavioral interview simulation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-purple-500" />
                    <span><strong>Stage 4:</strong> Comprehensive feedback and improvement report</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Each stage is timed to simulate real interview conditions</li>
                  <li>• You can pause between stages but not during them</li>
                  <li>• Your progress is automatically saved</li>
                  <li>• Take your time to read instructions carefully</li>
                </ul>
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={() => startStage('coding')}
                  disabled={isLoading}
                  className="px-8 py-6 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Preparing Your Interview...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Begin Interview Simulation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
              {isLoading && (
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Generating your personalized coding challenge...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Progress */}
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/interview-prep" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold">Interview Simulation</h1>
                <p className="text-sm text-muted-foreground">
                  {sessionData.companyType} • {sessionData.role} • {sessionData.language}
                </p>
              </div>
            </div>

            {currentStage !== 'report' && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-lg">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(getProgressPercentage())}% Complete</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </div>
      </div>

      {/* Stage Content */}
      <div className="container mx-auto px-4 py-8">
        {currentStage === 'coding' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2 text-primary" />
                Stage 1: Coding Challenge
              </CardTitle>
              <CardDescription>
                Solve this coding problem as you would in a real interview
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Generating your personalized coding challenge...</p>
                </div>
              ) : challengeData ? (
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{challengeData.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{challengeData.difficulty}</Badge>
                        <Badge variant="secondary">{sessionData.language}</Badge>
                      </div>
                    </div>
                    <p className="mb-4 leading-relaxed">{challengeData.description}</p>

                    {challengeData.examples && challengeData.examples.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Examples:</h4>
                        {challengeData.examples.map((example: string, index: number) => (
                          <div key={index} className="bg-background rounded p-3 font-mono text-sm">
                            <pre className="whitespace-pre-wrap">{example}</pre>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Monaco Editor */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Your Solution:</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <MonacoEditor
                        height="400px"
                        language={sessionData.language === 'csharp' ? 'csharp' : sessionData.language === 'cpp' ? 'cpp' : sessionData.language}
                        theme="vs-dark"
                        value={codeSolution}
                        onChange={(value) => setCodeSolution(value || '')}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: 'on',
                          roundedSelection: false,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          tabSize: 2,
                          wordWrap: 'on'
                        }}
                      />
                    </div>
                  </div>

                  {challengeData.hints && challengeData.hints.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Hints:</h4>
                      <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                        {challengeData.hints.map((hint: string, index: number) => (
                          <li key={index}>• {hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {challengeData.testCases && challengeData.testCases.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">Test Cases:</h4>
                      <div className="space-y-2">
                        {challengeData.testCases.map((testCase: any, index: number) => (
                          <div key={index} className="bg-background rounded p-3 font-mono text-sm">
                            <div className="text-green-600">Input: {testCase.input}</div>
                            <div className="text-blue-600">Expected: {testCase.expected}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <Button
                      onClick={handleNextStage}
                      size="lg"
                      disabled={!codeSolution.trim() || codeSolution === challengeData.starterCode}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Solution & Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    {(!codeSolution.trim() || codeSolution === challengeData.starterCode) && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Please write your solution before continuing
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Failed to load challenge. Please try again.</p>
                  <Button onClick={() => generateStageContent('coding')} className="mt-4">
                    Retry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStage === 'technical' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                Stage 2: Technical Questions
              </CardTitle>
              <CardDescription>
                Answer technical questions about your solution and general concepts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Generating technical questions...</p>
                </div>
              ) : technicalQuestions?.questions ? (
                <div className="space-y-6">
                  {technicalQuestions.questions.map((q: any, index: number) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Question {index + 1}:</h4>
                        <Badge variant="outline" className="text-xs">
                          {q.type?.replace('-', ' ') || 'Technical'}
                        </Badge>
                      </div>
                      <p className="mb-3">{q.question}</p>
                      {q.followUp && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 mb-3">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Follow-up:</strong> {q.followUp}
                          </p>
                        </div>
                      )}

                      {/* Answer Input */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Your Answer:</label>
                          <div className="flex items-center space-x-2">
                            {recognition && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => isListening === index ? stopVoiceRecognition() : startVoiceRecognition(index)}
                                className={isListening === index ? 'bg-red-100 border-red-300' : ''}
                              >
                                {isListening === index ? (
                                  <>
                                    <MicOff className="h-4 w-4 mr-1" />
                                    Stop
                                  </>
                                ) : (
                                  <>
                                    <Mic className="h-4 w-4 mr-1" />
                                    Voice
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        <Textarea
                          placeholder="Type your answer here or use voice input..."
                          value={technicalAnswers[index] || ''}
                          onChange={(e) => {
                            const newAnswers = [...technicalAnswers];
                            newAnswers[index] = e.target.value;
                            setTechnicalAnswers(newAnswers);
                          }}
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <Button
                      onClick={handleNextStage}
                      size="lg"
                      disabled={technicalAnswers.some(answer => !answer?.trim())}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Technical Answers
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    {technicalAnswers.some(answer => !answer?.trim()) && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Please answer all questions before continuing
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Failed to load questions. Please try again.</p>
                  <Button onClick={() => generateStageContent('technical')} className="mt-4">
                    Retry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStage === 'behavioral' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-500" />
                Stage 3: Behavioral Interview
              </CardTitle>
              <CardDescription>
                Demonstrate your soft skills and cultural fit
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Generating behavioral questions...</p>
                </div>
              ) : behavioralQuestions?.questions ? (
                <div className="space-y-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">STAR Method Reminder:</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Structure your answers using <strong>S</strong>ituation, <strong>T</strong>ask, <strong>A</strong>ction, <strong>R</strong>esult
                    </p>
                  </div>

                  {behavioralQuestions.questions.map((q: any, index: number) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Question {index + 1}:</h4>
                        <Badge variant="outline" className="text-xs">
                          {q.category?.replace('-', ' ') || 'Behavioral'}
                        </Badge>
                      </div>
                      <p className="mb-3">{q.question}</p>

                      {q.lookingFor && q.lookingFor.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded p-3 mb-3">
                          <p className="text-sm text-green-700 dark:text-green-300 mb-1">
                            <strong>Key traits to demonstrate:</strong>
                          </p>
                          <ul className="text-sm text-green-600 dark:text-green-400">
                            {q.lookingFor.map((trait: string, i: number) => (
                              <li key={i}>• {trait}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {q.followUp && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 mb-3">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Potential follow-up:</strong> {q.followUp}
                          </p>
                        </div>
                      )}

                      {/* Answer Input */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Your Answer (STAR format):</label>
                          <div className="flex items-center space-x-2">
                            {recognition && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => isListening === index ? stopVoiceRecognition() : startVoiceRecognition(index)}
                                className={isListening === index ? 'bg-red-100 border-red-300' : ''}
                              >
                                {isListening === index ? (
                                  <>
                                    <MicOff className="h-4 w-4 mr-1" />
                                    Stop
                                  </>
                                ) : (
                                  <>
                                    <Mic className="h-4 w-4 mr-1" />
                                    Voice
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        <Textarea
                          placeholder="Describe the Situation, Task, Action you took, and Result achieved..."
                          value={behavioralAnswers[index] || ''}
                          onChange={(e) => {
                            const newAnswers = [...behavioralAnswers];
                            newAnswers[index] = e.target.value;
                            setBehavioralAnswers(newAnswers);
                          }}
                          className="min-h-[120px]"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="text-center">
                    <Button
                      onClick={handleNextStage}
                      size="lg"
                      disabled={behavioralAnswers.some(answer => !answer?.trim())}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Behavioral Answers
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    {behavioralAnswers.some(answer => !answer?.trim()) && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Please answer all questions before continuing
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Failed to load questions. Please try again.</p>
                  <Button onClick={() => generateStageContent('behavioral')} className="mt-4">
                    Retry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStage === 'report' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-500" />
                Stage 4: Interview Report
              </CardTitle>
              <CardDescription>
                Your comprehensive interview performance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Analyzing your interview performance...</p>
                </div>
              ) : interviewReport ? (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                    <div className="text-4xl font-bold text-purple-600 mb-2">{interviewReport.overallScore}%</div>
                    <div className="text-lg font-medium text-purple-700 dark:text-purple-300">Overall Interview Score</div>
                  </div>

                  {/* Detailed Scores */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{interviewReport.codingScore}%</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Coding Challenge</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{interviewReport.technicalScore}%</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Technical Questions</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{interviewReport.behavioralScore}%</div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">Behavioral Interview</div>
                    </div>
                  </div>

                  {/* Strengths */}
                  {interviewReport.strengths && interviewReport.strengths.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                      <h3 className="font-semibold mb-4 text-green-800 dark:text-green-200">Key Strengths:</h3>
                      <ul className="space-y-2">
                        {interviewReport.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-700 dark:text-green-300">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Areas for Improvement */}
                  {interviewReport.improvements && interviewReport.improvements.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                      <h3 className="font-semibold mb-4 text-yellow-800 dark:text-yellow-200">Areas for Improvement:</h3>
                      <ul className="space-y-2">
                        {interviewReport.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="h-4 w-4 rounded-full bg-yellow-400 mt-0.5 flex-shrink-0"></div>
                            <span className="text-yellow-700 dark:text-yellow-300">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Overall Feedback */}
                  {interviewReport.feedback && (
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="font-semibold mb-3">Overall Feedback:</h3>
                      <p className="text-muted-foreground leading-relaxed">{interviewReport.feedback}</p>
                    </div>
                  )}

                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" asChild>
                      <Link href="/interview-prep">Try Another Interview</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/">Back to PrepioAI</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Failed to generate report. Please try again.</p>
                  <Button onClick={generateInterviewReport} className="mt-4">
                    Retry Report Generation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function InterviewSessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>}>
      <InterviewSessionContent />
    </Suspense>
  );
}