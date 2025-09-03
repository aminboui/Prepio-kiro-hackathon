"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Trophy,
  Target,
  TrendingUp,
  Code,
  Award,
  Star,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Flame,
  Sparkles,
} from "lucide-react"

import { getUserProgress, getCurrentUser, getUserStreak, type UserProgress } from "@/lib/supabase"
import { getUserLevel, getNextLevel, getProgressToNextLevel, LEVELS } from "@/lib/levels"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import AuthGuard from "@/lib/auth-guard"
import ActivityCalendar from "@/components/ActivityCalendar"

function ProfilePageContent() {
  const router = useRouter()
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [userId, setUserId] = useState<string>("")
  const [currentStreak, setCurrentStreak] = useState<number>(0)


  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    setIsLoading(true)
    try {
      const user = await getCurrentUser()
      if (!user) {
        router.push("/")
        return
      }

      setUserEmail(user.email || "")
      setUserId(user.id)
      setUserName(user.user_metadata?.full_name || user.email || "Anonymous User")
      const data = await getUserProgress()
      setProgress(data)

      // Calculate real streak based on challenge completion dates
      const streak = await getUserStreak()
      setCurrentStreak(streak)
    } catch (error) {
      console.error("Error loading user data:", error)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <Sparkles className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading your profile...</p>
            <p className="text-sm text-muted-foreground">Preparing your coding journey</p>
          </div>
        </div>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center space-y-6">
            <div className="relative">
              <div className="h-20 w-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Ready to Start?</h3>
              <p className="text-muted-foreground">
                Complete your first challenge to unlock your personalized coding profile!
              </p>
            </div>
            <Button onClick={() => router.push("/")} size="lg" className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Start Your Journey
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate display stats (same logic as ProgressDashboard)
  let displayProgress = progress
  if (progress.total_challenges === 0 && progress.recent_challenges.length > 0) {
    const correctCount = progress.recent_challenges.filter((c) => c.is_correct).length
    const totalCount = progress.recent_challenges.length
    const avgScore = progress.recent_challenges.reduce((sum, c) => sum + c.score, 0) / totalCount

    displayProgress = {
      ...progress,
      total_challenges: totalCount,
      correct_challenges: correctCount,
      incorrect_challenges: totalCount - correctCount,
      success_rate: Math.round((correctCount / totalCount) * 100),
      average_score: Math.round(avgScore),
    }
  }

  const currentLevel = getUserLevel(displayProgress.total_challenges)
  const nextLevel = getNextLevel(currentLevel)
  const levelProgress = getProgressToNextLevel(displayProgress.total_challenges, currentLevel)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <NavBar showGetStarted={false} showNavLinks={false} showLogout={true} />

      <main className="pt-20">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
          <div className="container mx-auto px-4 py-12 relative">
            <div className="flex items-center justify-between mb-8">
              <Button variant="ghost" onClick={() => router.push("/")} className="hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Challenges
              </Button>
              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Coding Profile
                </h1>
                <p className="text-muted-foreground mt-1">Your development journey</p>
              </div>
              <div className="w-[140px]"></div>
            </div>


            {/* Card Info */}
            <div className="relative">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-sm overflow-hidden relative">
                {/* Card Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-green-500/20"></div>
                  <div className="absolute top-4 right-4 w-32 h-32 border border-white/10 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/10 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full"></div>
                </div>

                {/* Premium Foil Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse"></div>

                <CardContent className="p-8 relative">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                    {/* Player Card Left Side */}
                    <div className="lg:col-span-3 space-y-6">
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                            <Code className="h-4 w-4 text-white font-bold" />
                          </div>
                          <span className="text-primary font-bold text-lg tracking-wider">CODER CARD</span>
                        </div>
                        <div className="text-right">
                          <div className="text-primary text-sm font-bold">LEVEL</div>
                          <div className="text-white text-3xl font-black">{currentLevel.level}</div>
                        </div>
                      </div>

                      {/* Player Info */}
                      <div className="flex items-start space-x-6">
                        <div className="relative">
                          {/* Player Avatar with Premium Border */}
                          <div className="relative">
                            <div className="h-32 w-32 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/30 rounded-2xl flex items-center justify-center text-6xl shadow-2xl border-2 border-primary/30">
                              {currentLevel.emoji}
                            </div>
                            {/* Holographic Corner */}
                            <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                              <Star className="h-4 w-4 text-white" />
                            </div>
                            {/* Level Badge */}
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                              <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-1 rounded-full border-2 border-white/20 shadow-lg">
                                <span className="text-white text-sm font-black">{currentLevel.level}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          {/* Player Name */}
                          <div>
                            <h2 className="text-4xl font-black text-white mb-2 tracking-wide">
                              {userName.toUpperCase()}
                            </h2>
                            {userName !== userEmail && <p className="text-gray-300 text-sm">{userEmail}</p>}
                          </div>

                          {/* Badges Container */}
                          <div className="flex items-center space-x-3">
                            {/* Rank Badge */}
                            <div className="inline-block">
                              <div
                                className="px-6 py-3 rounded-xl font-black text-black text-lg shadow-xl border-2 border-white/20 h-12 flex items-center"
                                style={{
                                  background: `linear-gradient(135deg, ${currentLevel.color}, ${currentLevel.color}dd)`,
                                }}
                              >
                                <Award className="h-5 w-5 mr-2" />
                                {currentLevel.name.toUpperCase()}
                              </div>
                            </div>

                            {/* Daily Streak - Compact */}
                            {currentStreak > 0 && (
                              <div className="inline-block">
                                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl px-4 py-3 border border-orange-500/30 backdrop-blur-sm h-12 flex items-center">
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1">
                                      {Array.from({ length: Math.min(currentStreak, 5) }, (_, i) => (
                                        <Flame
                                          key={i}
                                          className="h-4 w-4 text-orange-400 animate-pulse"
                                        />
                                      ))}
                                      {currentStreak > 5 && (
                                        <span className="text-orange-400 font-bold text-sm">+{currentStreak - 5}</span>
                                      )}
                                    </div>
                                    <div className="text-orange-400 font-black text-lg">
                                      {currentStreak}
                                    </div>
                                    <div className="text-white text-xs font-bold tracking-wider">
                                      DAY STREAK
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Player Description */}
                          <p className="text-gray-300 leading-relaxed max-w-md text-sm">{currentLevel.description}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {nextLevel && (
                        <div className="bg-black/40 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Target className="h-5 w-5 text-primary" />
                              <span className="font-bold text-white">NEXT RANK: {nextLevel.name.toUpperCase()}</span>
                              <span className="text-2xl">{nextLevel.emoji}</span>
                            </div>
                            <span className="text-sm text-gray-300 font-mono bg-black/40 px-3 py-1 rounded-full">
                              {levelProgress.current} / {levelProgress.needed}
                            </span>
                          </div>
                          <div className="relative">
                            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-primary to-primary/80 h-4 rounded-full transition-all duration-1000 shadow-lg"
                                style={{ width: `${levelProgress.percentage}%` }}
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
                          </div>
                          <p className="text-sm text-gray-300 mt-2 flex items-center">
                            <Flame className="h-4 w-4 inline mr-1 text-orange-400" />
                            {nextLevel.minChallenges - displayProgress.total_challenges} challenges to rank up!
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Player Stats */}
                    <div className="lg:col-span-2 pt-4">
                      <div className="bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                        {/* Overall Rating */}
                        <div className="text-center mb-6">
                          <div className="relative inline-block">
                            <div className="text-8xl font-black text-primary leading-none">
                              {displayProgress.success_rate}
                            </div>
                            <div className="absolute -top-2 -right-6 text-primary text-2xl font-bold">%</div>
                          </div>
                          <div className="text-white font-bold text-lg tracking-wider mt-2">SUCCESS RATE</div>
                          <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/80 mx-auto mt-2 rounded-full"></div>
                        </div>



                        {/* Player Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center bg-black/40 rounded-xl p-4 border border-white/5">
                            <div className="text-3xl font-black text-green-400">{displayProgress.total_challenges}</div>
                            <div className="text-white text-xs font-bold tracking-wider">CHALLENGES</div>
                          </div>
                          <div className="text-center bg-black/40 rounded-xl p-4 border border-white/5">
                            <div className="text-3xl font-black text-blue-400">
                              {Math.round(displayProgress.average_score)}
                            </div>
                            <div className="text-white text-xs font-bold tracking-wider">AVG SCORE</div>
                          </div>
                          <div className="text-center bg-black/40 rounded-xl p-4 border border-white/5">
                            <div className="text-3xl font-black text-green-400">
                              {displayProgress.correct_challenges}
                            </div>
                            <div className="text-white text-xs font-bold tracking-wider">CORRECT</div>
                          </div>
                          <div className="text-center bg-black/40 rounded-xl p-4 border border-white/5">
                            <div className="text-3xl font-black text-purple-400">{currentLevel.level}</div>
                            <div className="text-white text-xs font-bold tracking-wider">LEVEL</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity Calendar */}
            <div className="mt-12">
              <ActivityCalendar userId={userId} />
            </div>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80 mt-12">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-2xl">
                      <Trophy className="h-6 w-6 mr-3 text-yellow-500" />
                      Achievement Levels
                    </CardTitle>
                    <CardDescription className="mt-2">Your progression through the coding mastery path</CardDescription>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1">
                    {LEVELS.filter((level) => displayProgress.total_challenges >= level.minChallenges).length} /{" "}
                    {LEVELS.length} Unlocked
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {LEVELS.map((level) => {
                    const isUnlocked = displayProgress.total_challenges >= level.minChallenges
                    const isCurrent = currentLevel.level === level.level

                    return (
                      <div
                        key={level.level}
                        className={`relative p-6 rounded-2xl border-2 text-center transition-all duration-300 hover:scale-105 ${isUnlocked
                          ? isCurrent
                            ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/20"
                            : "border-green-500/30 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 shadow-lg"
                          : "border-muted bg-muted/20 opacity-60"
                          }`}
                      >
                        <div className="text-4xl mb-3">{isUnlocked ? level.emoji : "🔒"}</div>
                        <div className="space-y-2">
                          <div className="font-bold text-sm">{level.name}</div>
                          <div className="text-xs text-muted-foreground">Level {level.level}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {level.minChallenges}+ challenges
                          </div>
                        </div>
                        {isCurrent && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="text-xs shadow-lg bg-primary">Current</Badge>
                          </div>
                        )}
                        {isUnlocked && !isCurrent && (
                          <div className="absolute -top-2 -right-2">
                            <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Code className="h-5 w-5 mr-3 text-blue-500" />
                    Languages Mastered
                  </CardTitle>
                  <CardDescription>Your coding language expertise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(displayProgress.challenges_by_language)
                    .sort(([, a], [, b]) => (b as number) - (a as number)) // Sort by count (highest first)
                    .map(([language, count]) => (
                      <div key={language} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-lg">{language}</span>
                          <Badge variant="secondary" className="font-mono">
                            {count}
                          </Badge>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-muted rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500"
                              style={{
                                width: `${(count / displayProgress.total_challenges) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round((count / displayProgress.total_challenges) * 100)}% of total challenges
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <BarChart3 className="h-5 w-5 mr-3 text-green-500" />
                    Difficulty Levels
                  </CardTitle>
                  <CardDescription>Challenge complexity breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(displayProgress.challenges_by_skill_level)
                    .sort(([, a], [, b]) => (b as number) - (a as number)) // Sort by count (highest first)
                    .map(([level, count]) => (
                      <div key={level} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-lg capitalize">{level}</span>
                          <Badge variant="secondary" className="font-mono">
                            {count}
                          </Badge>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-muted rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500"
                              style={{
                                width: `${(count / displayProgress.total_challenges) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round((count / displayProgress.total_challenges) * 100)}% of total challenges
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>

            {displayProgress.recent_challenges.length > 0 && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80 mt-12">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Clock className="h-5 w-5 mr-3 text-orange-500" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest coding challenges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {displayProgress.recent_challenges.slice(0, 8).map((challenge, index) => (
                      <div
                        key={challenge.id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${challenge.is_correct
                          ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/30"
                          : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/30"
                          }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${challenge.is_correct ? "bg-green-500/20" : "bg-red-500/20"
                              }`}
                          >
                            {challenge.is_correct ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{challenge.title}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {challenge.language}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {challenge.skill_level}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-bold text-xl">{challenge.score}%</p>
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

            <div className="text-center space-y-4 py-8">
              <div className="space-x-4">
                <Button
                  onClick={() => router.push("/")}
                  size="lg"
                  className="px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Continue Coding
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Refresh Stats
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Keep coding to unlock new levels and achievements!</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />


    </div>
  )
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfilePageContent />
    </AuthGuard>
  )
}
