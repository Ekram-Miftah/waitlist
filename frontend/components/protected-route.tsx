"use client";

import type React from "react";
import { useState, useEffect } from "react"; // 🚨 FIX 1: Import useState
import { useRouter } from "next/navigation";
import { useAuthStore } from "../lib/auth-store";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const token = useAuthStore((state) => state.token);
  const isAuthenticated = !!token;

  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    setIsClientLoaded(true);

    if (!isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, router]);

  if (!isClientLoaded || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#2A2A3C]" />
      </div>
    );
  }

  return <>{children}</>;
}
