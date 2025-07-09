"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Clock, Users, Calendar, Target, Award, Activity } from "lucide-react"
import type { CalendarEvent } from "@/components/calendar/ReusableCalendar"

interface AnalyticsContentProps {
  events: CalendarEvent[]
}

export function AnalyticsContent({ events }: AnalyticsContentProps) {
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

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">Insights and metrics for your meeting performance</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{totalMeetings}</div>
            <p className="text-xs text-muted-foreground">+{weeklyMeetings} this week</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {Math.round((completedMeetings / totalMeetings) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {completedMeetings} of {totalMeetings} completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {Math.round(avgMeetingDuration)}m
            </div>
            <p className="text-xs text-muted-foreground">Average meeting length</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendees</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              {Math.round(0)}
            </div>
            <p className="text-xs text-muted-foreground">Per meeting</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Department Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
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
                  <Progress value={(count / totalMeetings) * 100} className="h-2" />
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
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
              <Progress value={(timeDistribution.morning / totalMeetings) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Afternoon (12PM - 5PM)</span>
                <span className="text-sm text-muted-foreground">{timeDistribution.afternoon} meetings</span>
              </div>
              <Progress value={(timeDistribution.afternoon / totalMeetings) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Evening (5PM+)</span>
                <span className="text-sm text-muted-foreground">{timeDistribution.evening} meetings</span>
              </div>
              <Progress value={(timeDistribution.evening / totalMeetings) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Award className="h-5 w-5" />
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

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <TrendingUp className="h-5 w-5" />
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

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Clock className="h-5 w-5" />
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
      </div>
    </div>
  )
}
