"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Flame, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface TooltipData {
  day: ActivityDay
  x: number
  y: number
}

interface ActivityDay {
  date: string
  count: number
  level: number // 0-4 for different intensity levels
}

interface ActivityCalendarProps {
  userId?: string
}

const ActivityCalendar = ({ userId }: ActivityCalendarProps) => {
  const [activityData, setActivityData] = useState<ActivityDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalContributions, setTotalContributions] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)


  useEffect(() => {
    if (userId) {
      loadActivityData()
    }
  }, [userId])

  const loadActivityData = async () => {
    setIsLoading(true)
    try {
      // Get the last 365 days of activity
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 365)

      // Check if supabase is available
      if (!supabase) {
        console.error('Supabase client not available')
        return
      }

      // Query challenges from the last year for this user
      const { data: challenges, error } = await supabase
        .from("challenges")
        .select("completed_at")
        .eq("user_id", userId)
        .gte("completed_at", startDate.toISOString())
        .lte("completed_at", endDate.toISOString())
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: true })

      if (error) {
        console.error("Error fetching activity data:", error)
        return
      }

      // Process the data into daily counts
      const dailyCounts: { [key: string]: number } = {}

      challenges?.forEach((challenge) => {
        const date = new Date(challenge.completed_at).toISOString().split("T")[0]
        dailyCounts[date] = (dailyCounts[date] || 0) + 1
      })

      // Generate activity data for the last 365 days
      const activityDays: ActivityDay[] = []
      const currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0]
        const count = dailyCounts[dateStr] || 0

        // Calculate intensity level (0-4)
        let level = 0
        if (count > 0) {
          if (count >= 5) level = 4
          else if (count >= 3) level = 3
          else if (count >= 2) level = 2
          else level = 1
        }

        activityDays.push({
          date: dateStr,
          count,
          level,
        })

        currentDate.setDate(currentDate.getDate() + 1)
      }

      setActivityData(activityDays)
      setTotalContributions(challenges?.length || 0)

      // Calculate streaks
      calculateStreaks(activityDays)
    } catch (error) {
      console.error("Error loading activity data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStreaks = (days: ActivityDay[]) => {
    let current = 0
    let longest = 0
    let temp = 0

    // Calculate current streak (from today backwards)
    const today = new Date().toISOString().split("T")[0]
    const todayIndex = days.findIndex((day) => day.date === today)

    if (todayIndex >= 0) {
      for (let i = todayIndex; i >= 0; i--) {
        if (days[i].count > 0) {
          current++
        } else {
          break
        }
      }
    }

    // Calculate longest streak
    for (const day of days) {
      if (day.count > 0) {
        temp++
        longest = Math.max(longest, temp)
      } else {
        temp = 0
      }
    }

    setCurrentStreak(current)
    setLongestStreak(longest)
  }

  const getIntensityColor = (level: number) => {
    const colors = [
      "bg-gray-900/30 border border-gray-800/50", // 0 contributions - very dark
      "bg-gray-700/60 border border-gray-600/30", // 1 contribution - dark gray
      "bg-gray-600/70 border border-gray-500/40", // 2 contributions - medium gray
      "bg-gray-500/80 border border-gray-400/50", // 3-4 contributions - lighter gray
      "bg-gray-400 border border-gray-300/60", // 5+ contributions - lightest gray
    ]
    return colors[level] || colors[0]
  }



  const handleMouseEnter = (day: ActivityDay, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      day,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    })
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  // Group days by weeks for display
  const getWeeksData = () => {
    const weeks: (ActivityDay | null)[][] = []
    let currentWeek: (ActivityDay | null)[] = new Array(7).fill(null)
    let weekStarted = false

    activityData.forEach((day) => {
      const dayOfWeek = new Date(day.date).getDay()

      // If this is the first day we're processing, start the week
      if (!weekStarted) {
        weekStarted = true
        currentWeek = new Array(7).fill(null)
      }

      // If we hit Sunday and we already have data in the week, start a new week
      if (dayOfWeek === 0 && currentWeek.some((d) => d !== null)) {
        weeks.push([...currentWeek])
        currentWeek = new Array(7).fill(null)
      }

      currentWeek[dayOfWeek] = day
    })

    // Push the final week if it has any data
    if (currentWeek.some((d) => d !== null)) {
      weeks.push(currentWeek)
    }

    return weeks
  }



  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-950 to-gray-900/90">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Calendar className="h-5 w-5 mr-3 text-gray-400" />
            Coding Activity
          </CardTitle>
          <CardDescription>Your daily coding contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const weeks = getWeeksData()

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-950 to-gray-900/90">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-xl">
              <Calendar className="h-5 w-5 mr-3 text-green-500" />
              Coding Activity
            </CardTitle>
            <CardDescription>Your daily coding contributions over the past year</CardDescription>
          </div>
          <div className="text-right space-y-1">
            <div className="text-2xl font-bold text-gray-300">{totalContributions}</div>
            <div className="text-xs text-muted-foreground">contributions</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-900/40 rounded-lg border border-gray-800/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="text-lg font-bold text-gray-300">{totalContributions}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-3 bg-gray-900/40 rounded-lg border border-gray-800/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-center space-x-1">
              <Flame className="h-4 w-4 text-gray-400" />
              <span className="text-lg font-bold text-gray-300">{currentStreak}</span>
            </div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center p-3 bg-gray-900/40 rounded-lg border border-gray-800/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-center space-x-1">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span className="text-lg font-bold text-gray-300">{longestStreak}</span>
            </div>
            <div className="text-xs text-muted-foreground">Longest Streak</div>
          </div>
        </div>

        {/* GitHub-Style Activity Calendar - Full Width */}
        <div className="space-y-3 relative">
          {/* Full Width Calendar Grid */}
          <div className="w-full overflow-x-auto pb-2">
            <div className="flex gap-1 justify-start w-full min-w-max">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const day = week[dayIndex]
                    if (!day) {
                      return <div key={dayIndex} className="w-3 h-3" />
                    }
                    return (
                      <div
                        key={day.date}
                        className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-gray-400/60 hover:z-10 relative ${getIntensityColor(day.level)}`}
                        onMouseEnter={(e) => handleMouseEnter(day, e)}
                        onMouseLeave={handleMouseLeave}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Custom Tooltip */}
          {tooltip && (
            <div
              className="fixed z-50 px-3 py-2 text-sm bg-popover border border-border rounded-md shadow-lg pointer-events-none"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translateX(-50%) translateY(-100%)'
              }}
            >
              <div className="font-medium">
                {new Date(tooltip.day.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </div>
              <div className="text-muted-foreground">
                {tooltip.day.count === 0
                  ? "No challenges completed"
                  : tooltip.day.count === 1
                    ? "1 challenge completed"
                    : `${tooltip.day.count} challenges completed`
                }
              </div>
            </div>
          )}

          {/* Minimal Legend */}
          <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-2.5 h-2.5 rounded-sm ${getIntensityColor(level)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { ActivityCalendar }
export default ActivityCalendar
