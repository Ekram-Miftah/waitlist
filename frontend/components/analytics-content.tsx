"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Activity, Loader2 } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useAuthStore } from "@/lib/auth-store"
import { fetchWaitlistEntries, calculateAnalytics } from "@/lib/api"

export function AnalyticsContent() {
  const token = useAuthStore((state) => state.token)
  const [mounted, setMounted] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!token) return

      setIsLoading(true)
      const entries = await fetchWaitlistEntries(token)
      const analyticsData = calculateAnalytics(entries)
      setAnalytics(analyticsData)
      setIsLoading(false)
    }

    if (mounted) {
      loadAnalytics()
    }
  }, [token, mounted])

  if (!mounted || isLoading) {
    return (
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2A2A3C]">Analytics</h1>
            <p className="text-[#8B8B9E] mt-2">Track your waitlist performance and insights</p>
          </div>
          {isLoading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-[#2A2A3C]" />
            </div>
          )}
        </div>
      </main>
    )
  }

  const growthIndicator = analytics.weeklyGrowth >= 0 ? "+" : ""
  const growthColor = analytics.weeklyGrowth >= 0 ? "text-green-600" : "text-red-600"

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2A2A3C]">Analytics</h1>
          <p className="text-[#8B8B9E] mt-2">Track your waitlist performance and insights</p>
        </div>

        {/* Key Metrics - Using real calculated data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-[#E8D5C4]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#8B8B9E]">This Week</CardTitle>
              <TrendingUp className="w-4 h-4 text-[#C9A88A]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2A2A3C]">{analytics.thisWeekSignups}</div>
              <p className={`text-xs ${growthColor} mt-1`}>
                {growthIndicator}
                {analytics.weeklyGrowth.toFixed(1)}% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8D5C4]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#8B8B9E]">Avg. Daily Signups</CardTitle>
              <Users className="w-4 h-4 text-[#C9A88A]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2A2A3C]">{analytics.avgDailySignups.toFixed(1)}</div>
              <p className="text-xs text-[#8B8B9E] mt-1">Last 7 days average</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8D5C4]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#8B8B9E]">Last Week</CardTitle>
              <Activity className="w-4 h-4 text-[#C9A88A]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2A2A3C]">{analytics.lastWeekSignups}</div>
              <p className="text-xs text-[#8B8B9E] mt-1">Previous 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts - Using real calculated data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Signup Trend */}
          <Card className="bg-white border-[#E8D5C4]">
            <CardHeader>
              <CardTitle className="text-[#2A2A3C]">Signup Trend</CardTitle>
              <CardDescription>Weekly signups over the last 8 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.signupTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C4" />
                  <XAxis dataKey="date" stroke="#8B8B9E" />
                  <YAxis stroke="#8B8B9E" />
                  <Tooltip />
                  <Line type="monotone" dataKey="signups" stroke="#C9A88A" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card className="bg-white border-[#E8D5C4]">
            <CardHeader>
              <CardTitle className="text-[#2A2A3C]">Weekly Activity</CardTitle>
              <CardDescription>Signups by day (last 7 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C4" />
                  <XAxis dataKey="day" stroke="#8B8B9E" />
                  <YAxis stroke="#8B8B9E" />
                  <Tooltip />
                  <Bar dataKey="signups" fill="#C9A88A" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
