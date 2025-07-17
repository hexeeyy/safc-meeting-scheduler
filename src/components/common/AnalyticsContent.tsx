"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Clock, Users, Calendar, Target, Award, Activity, X } from "lucide-react"
import type { CalendarEvent } from "@/components/calendar/ReusableCalendar"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface AnalyticsContentProps {
  events: CalendarEvent[]
}

export function AnalyticsContent({ events }: AnalyticsContentProps) {
  const router = useRouter()
  const today = new Date()
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Calculate metrics
  const totalMeetings = events.length
  const completedMeetings = events.filter((e) => e.end < today).length
  const weeklyMeetings = events.filter((e) => e.start >= lastWeek).length
  const monthlyMeetings = events.filter((e) => e.start >= lastMonth).length

  const avgMeetingDuration =
    events.reduce((acc, event) => {
      return acc + (event.end.getTime() - event.start.getTime())
    }, 0) /
    events.length /
    (1000 * 60) // in minutes

  const departmentStats = events.reduce(
    (acc, event) => {
      acc[event.department] = (acc[event.department] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Time distribution
  const timeDistribution = events.reduce(
    (acc, event) => {
      const hour = event.start.getHours()
      if (hour >= 9 && hour < 12) acc.morning++
      else if (hour >= 12 && hour < 17) acc.afternoon++
      else acc.evening++
      return acc
    },
    { morning: 0, afternoon: 0, evening: 0 },
  )

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Actionable insights for your meeting performance</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full hover:bg-green-500 hover:text-white transition-colors duration-200"
          onClick={() => router.push('/')}
          aria-label="Return to home"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Key Metrics */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 transition-transform hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Total Meetings</CardTitle>
              <Calendar className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalMeetings}</div>
              <p className="text-sm text-muted-foreground mt-1">+{weeklyMeetings} this week</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 transition-transform hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Completion Rate</CardTitle>
              <Target className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {Math.round((completedMeetings / totalMeetings) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {completedMeetings} of {totalMeetings} completed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 transition-transform hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Avg Duration</CardTitle>
              <Clock className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {Math.round(avgMeetingDuration)}m
              </div>
              <p className="text-sm text-muted-foreground mt-1">Average meeting length</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 transition-transform hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Avg Attendees</CardTitle>
              <Users className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {Math.round(0)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Per meeting</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Department Performance */}
        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg transition-transform hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Department Performance
              </CardTitle>
              <CardDescription>Meeting activity by department</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(departmentStats)
                .sort(([, a], [, b]) => b - a)
                .map(([dept, count]) => (
                  <div key={dept} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{dept}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{count} meetings</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round((count / totalMeetings) * 100)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={(count / totalMeetings) * 100} className="h-2 bg-blue-100" />
                  </div>
                ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Time Distribution */}
        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg transition-transform hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Activity className="h-6 w-6 text-green-600" />
                Meeting Time Distribution
              </CardTitle>
              <CardDescription>When meetings typically occur</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Morning (9AM - 12PM)</span>
                  <span className="text-sm text-muted-foreground">{timeDistribution.morning} meetings</span>
                </div>
                <Progress value={(timeDistribution.morning / totalMeetings) * 100} className="h-2 bg-green-100" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Afternoon (12PM - 5PM)</span>
                  <span className="text-sm text-muted-foreground">{timeDistribution.afternoon} meetings</span>
                </div>
                <Progress value={(timeDistribution.afternoon / totalMeetings) * 100} className="h-2 bg-green-100" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Evening (5PM+)</span>
                  <span className="text-sm text-muted-foreground">{timeDistribution.evening} meetings</span>
                </div>
                <Progress value={(timeDistribution.evening / totalMeetings) * 100} className="h-2 bg-green-100" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Insights */}
      <motion.div
        className="grid gap-6 md:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 transition-transform hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-300">
                <Award className="h-6 w-6" />
                Best Performing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">
                  {Object.entries(departmentStats).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Most active department with {Object.entries(departmentStats).sort(([, a], [, b]) => b - a)[0]?.[1] || 0}{" "}
                  meetings
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 transition-transform hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-700 dark:text-blue-300">
                <TrendingUp className="h-6 w-6" />
                Growth Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">+{Math.round((weeklyMeetings / monthlyMeetings) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Weekly meeting increase compared to monthly average</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 transition-transform hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-purple-700 dark:text-purple-300">
                <Clock className="h-6 w-6" />
                Efficiency Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">
                  {Math.round(((completedMeetings / totalMeetings) * 100 + (avgMeetingDuration < 60 ? 100 : 50)) / 2)}%
                </p>
                <p className="text-sm text-muted-foreground">Based on completion rate and duration</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}