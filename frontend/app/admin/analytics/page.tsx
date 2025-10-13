"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AnalyticsContent } from "@/components/analytics-content"

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[#F5F0EB]">
        <AdminSidebar />
        <AnalyticsContent />
      </div>
    </ProtectedRoute>
  )
}
