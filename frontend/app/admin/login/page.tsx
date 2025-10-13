import { AdminLoginForm } from "@/components/admin-login-form"
import { Sparkles } from "lucide-react"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F0EB] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <Sparkles className="w-8 h-8 text-[#2A2A3C]" />
        <span className="text-2xl font-bold text-[#2A2A3C]">Luminary Labs</span>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <AdminLoginForm />
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-[#8B8B9E]">Protected admin area</p>
    </div>
  )
}
