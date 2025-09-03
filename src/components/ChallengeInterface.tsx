'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle, 
  XCircle,
  Target,
  Zap,
  TrendingUp,
  Shuffle,
  BarChart3
} from 'lucide-react';
import CodeEditor from './CodeEditor';
import NavBar from './NavBar';
import Footer from './Footer';
import ProgressDashboard from './ProgressDashboard';
import { Challenge, FeedbackResponse } from '@/lib/ai';
import { supabase, getCurrentUser } from '@/lib/supabase';

interface ChallengeInterfaceProps {
  challenge: Challenge;
  onBack: () => void;
  onSubmit: (code: string) => Promise<void>;
  onNewChallenge: () => Promise<void>;
  feedback: FeedbackResponse | null;
  isEvaluating: boolean;
  isGeneratingNew: boolean;
}

export default function ChallengeInterface({
  challenge,
  onBack,
  onSubmit,
  onNewChallenge,
  feedback,
  isEvaluating,
  isGeneratingNew,
}: ChallengeInterfaceProps) {
  const [userCode, setUserCode] = useState(challenge.code);
  const [showHints, setShowHints] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const user = await getCurrentUser();
    setIsAuthenticated(!!user);
  };

  const handleProgressClick = async () => {
    const user = await getCurrentUser();
    if (user) {
      setShowProgress(true);
    } else {
      // Redirect to signin page with current page as redirect
      window.location.href = '/auth/signin?redirect=' + encodeURIComponent(window.location.pathname);
    }
  };



  // Debug logging
  console.log('Challenge received:', challenge);
  console.log('Challenge code:', challenge.code);

  // Update userCode when challenge changes
  useEffect(() => {
    setUserCode(challenge.code);
  }, [challenge.code]);

  const handleSubmit = async () => {
    await onSubmit(userCode);
  };

  const handleReset = () => {
    setUserCode(challenge.code);
  };

  return (
    <div className="h-screen flex flex-col">
      
      
      {/* Header */}
      <div className="border-b border-border p-4 flex-shrink-0 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{challenge.language}</Badge>
              <Badge variant="outline">{challenge.skillLevel}</Badge>
              <Badge variant="outline">
                {challenge.challengeType === 'bug-fix' ? 'Bug Fix' : 'Code Completion'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHints(!showHints)}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Hints
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNewChallenge}
              disabled={isGeneratingNew}
            >
              <Shuffle className="h-4 w-4 mr-2" />
              {isGeneratingNew ? 'Generating...' : 'New Challenge'}
            </Button>
            {supabase && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleProgressClick}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {isAuthenticated ? 'Progress' : 'Track Progress'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Challenge Description */}
        <div className="w-1/3 border-r border-border p-4 overflow-y-auto flex-shrink-0">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                <CardDescription>{challenge.description}</CardDescription>
              </CardHeader>
              {challenge.expectedOutput && (
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Expected Output:</h4>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm">
                      {challenge.expectedOutput}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {showHints && challenge.hints && challenge.hints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                    Hints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {challenge.hints.map((hint, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {hint}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {feedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    {feedback.isCorrect ? (
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 mr-2 text-red-500" />
                    )}
                    Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {feedback.score}%
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          Correctness
                        </span>
                        <span>{feedback.correctness}%</span>
                      </div>
                      <Progress value={feedback.correctness} className="h-2" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Zap className="h-4 w-4 mr-1" />
                          Efficiency
                        </span>
                        <span>{feedback.efficiency}%</span>
                      </div>
                      <Progress value={feedback.efficiency} className="h-2" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Code Quality
                        </span>
                        <span>{feedback.codeQuality}%</span>
                      </div>
                      <Progress value={feedback.codeQuality} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Detailed Feedback:</h4>
                    <p className="text-sm text-muted-foreground">{feedback.feedback}</p>
                  </div>

                  {feedback.suggestions && feedback.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Suggestions:</h4>
                      <ul className="space-y-1">
                        {feedback.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Code Editor</h3>
              <Button
                onClick={handleSubmit}
                disabled={isEvaluating}
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>{isEvaluating ? 'Evaluating...' : 'Submit Solution'}</span>
              </Button>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <CodeEditor
              value={userCode}
              onChange={(value) => setUserCode(value || '')}
              language={challenge.language}
              height="100%"
            />
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Progress Dashboard Modal */}
      {showProgress && (
        <ProgressDashboard 
          onClose={() => setShowProgress(false)} 
        />
      )}
    </div>
  );
}