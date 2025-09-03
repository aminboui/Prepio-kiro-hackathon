'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Target,
  Award,
  Clock,
  Code,
  CheckCircle,
  XCircle,
  BarChart3,
  X,
  Trophy
} from 'lucide-react';
import { getUserProgress, UserProgress, getCurrentUser } from '@/lib/supabase';

interface ProgressDashboardProps {
  onClose: () => void;
}

export default function ProgressDashboard({ onClose }: ProgressDashboardProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setIsLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        setIsLoading(false);
        return;
      }
      const data = await getUserProgress();
      console.log('Progress data received:', data);
      setProgress(data);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading your progress...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if we have any data to display
  const hasData = progress && (progress.total_challenges > 0 || progress.recent_challenges.length > 0);

  if (!hasData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Your Progress
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No challenges completed yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete your first challenge to start tracking your progress!
              </p>
              <Button onClick={onClose}>Start Coding</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // At this point, we know progress is not null and has data
  // Calculate display stats from recent_challenges if main stats are missing
  let displayProgress = progress!; // Non-null assertion since we checked hasData above

  if (progress!.total_challenges === 0 && progress!.recent_challenges.length > 0) {
    const correctCount = progress!.recent_challenges.filter(c => c.is_correct).length;
    const totalCount = progress!.recent_challenges.length;
    const avgScore = progress!.recent_challenges.reduce((sum, c) => sum + c.score, 0) / totalCount;

    displayProgress = {
      ...progress!,
      total_challenges: totalCount,
      correct_challenges: correctCount,
      incorrect_challenges: totalCount - correctCount,
      success_rate: Math.round((correctCount / totalCount) * 100),
      average_score: Math.round(avgScore)
    };
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <BarChart3 className="h-6 w-6 mr-2 text-primary" />
              Your Coding Progress
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Challenges</p>
                    <p className="text-2xl font-bold">{displayProgress.total_challenges}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Correct</p>
                    <p className="text-2xl font-bold text-green-500">{displayProgress.correct_challenges}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">{displayProgress.success_rate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Score</p>
                    <p className="text-2xl font-bold">{Math.round(displayProgress.average_score)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Languages Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(displayProgress.challenges_by_language).map(([language, count]) => (
                    <div key={language} className="flex items-center justify-between">
                      <span className="font-medium">{language}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(count / displayProgress.total_challenges) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skill Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Skill Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(displayProgress.challenges_by_skill_level).map(([level, count]) => (
                    <div key={level} className="flex items-center justify-between">
                      <span className="font-medium capitalize">{level}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(count / displayProgress.total_challenges) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Challenges */}
          {displayProgress.recent_challenges.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayProgress.recent_challenges.slice(0, 5).map((challenge) => (
                    <div key={challenge.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {challenge.is_correct ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{challenge.title}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {challenge.language}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {challenge.skill_level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{challenge.score}%</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(challenge.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 text-center space-x-4">
            <Button onClick={onClose} size="lg">
              Continue Coding
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                onClose();
                window.open('/profile', '_blank');
              }}
            >
              <Trophy className="h-5 w-5 mr-2 mb-1" />
              See Full Progress
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}