"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { fetchWaitlistEntries, calculateStats, type WaitlistEntry, type WaitlistStats } from "@/lib/api"
import { Users, TrendingUp, Clock, Loader2 } from "lucide-react"

export function AdminDashboardContent() {
  const token = useAuthStore((state) => state.token)
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [stats, setStats] = useState<WaitlistStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!token) return

      setIsLoading(true)
      const entriesData = await fetchWaitlistEntries(token)
      const statsData = calculateStats(entriesData)

      setEntries(entriesData)
      setStats(statsData)
      setIsLoading(false)
    }

    loadData()
  }, [token])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2A2A3C]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-[#E5E5E8] shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#F5F0EB]">
              <Users className="w-5 h-5 text-[#C9A88A]" />
            </div>
            <h3 className="text-sm font-medium text-[#8B8B9E]">Total Signed Up</h3>
          </div>
          <p className="text-3xl font-bold text-[#2A2A3C]">{stats?.total_signups.toLocaleString() || 0}</p>
          <p className="text-xs text-[#8B8B9E] mt-1">Lifetime signups</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E5E8] shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#F5F0EB]">
              <TrendingUp className="w-5 h-5 text-[#C9A88A]" />
            </div>
            <h3 className="text-sm font-medium text-[#8B8B9E]">New This Week</h3>
          </div>
          <p className="text-3xl font-bold text-[#2A2A3C]">{stats?.new_this_week || 0}</p>
          <p className="text-xs text-[#8B8B9E] mt-1">Last 7 days</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E5E8] shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#F5F0EB]">
              <Clock className="w-5 h-5 text-[#C9A88A]" />
            </div>
            <h3 className="text-sm font-medium text-[#8B8B9E]">Est. Wait Time</h3>
          </div>
          <p className="text-3xl font-bold text-[#2A2A3C]">{stats?.estimated_wait_time || "0 Weeks"}</p>
          <p className="text-xs text-[#8B8B9E] mt-1">Current estimate</p>
        </div>
      </div>

      {/* Waitlist Entries Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E8] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E5E5E8]">
          <h2 className="text-xl font-bold text-[#2A2A3C]">Waitlist Entries</h2>
          <p className="text-sm text-[#8B8B9E] mt-1">All registered users</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9F9FA]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#8B8B9E] uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#8B8B9E] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#8B8B9E] uppercase tracking-wider">
                  Signup Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E8]">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-[#8B8B9E]">
                    No waitlist entries yet
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => (
                  <tr key={entry.id} className="hover:bg-[#F9F9FA] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2A2A3C]">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2A2A3C]">{entry.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8B8B9E]">
                      {new Date(entry.signup_date.replace(" ", "T")).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
