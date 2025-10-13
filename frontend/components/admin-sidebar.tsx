"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
// Removed 'Settings' from imports since it's no longer used, but kept for clarity
import { Sparkles, Home, BarChart3, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  // 🚨 FIX: Removed the 'Settings' entry from the navigation array
  const navItems = [
    { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    // ❌ REMOVED: { href: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-[#2A2A3C] text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          <span className="text-xl font-bold">Luminary Labs</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          <p className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Waitlist Management
          </p>
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 hover:bg-white/10",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-white/60 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>

      {/* Decorative elements */}
      <div className="p-6 opacity-20">
        <svg width="100%" height="80" viewBox="0 0 200 80" fill="none">
          <path d="M20 40 L40 20 L40 60 Z" fill="white" opacity="0.3" />
          <path d="M60 40 L80 20 L80 60 Z" fill="white" opacity="0.2" />
        </svg>
      </div>
    </aside>
  );
}
