import { ProtectedRoute } from "@/components/protected-route"
import { AdminDashboardContent } from "@/components/admin-dashboard-content"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F5F0EB] flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#2A2A3C]">Dashboard</h1>
              <p className="text-[#8B8B9E] mt-1">Manage your waitlist and track signups</p>
            </div>
            <AdminDashboardContent />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
