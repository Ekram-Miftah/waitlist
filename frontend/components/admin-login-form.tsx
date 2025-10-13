"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLoginSchema, type AdminLoginFormData } from "@/lib/schemas";
import { adminLogin } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2, Lock } from "lucide-react";

export function AdminLoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 🚨 FIX: Correctly select the action that exists in the store.
  const setToken = useAuthStore((state) => state.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (formData: AdminLoginFormData) => {
    setIsSubmitting(true);
    setError(null);

    // 🚨 FIX: Construct the full data object expected by the API.
    const loginData = {
      email: "admin", // Hardcoded username
      password: formData.password,
    };

    const result = await adminLogin(loginData);

    if (result.success && result.token) {
      setToken(result.token);
      router.push("/admin/dashboard");
    } else {
      setError(result.message || "Invalid credentials. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2A2A3C] mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-[#2A2A3C]">Admin Access</h1>
        <p className="text-[#8B8B9E]">Enter your password to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#2A2A3C]">
            Password
          </Label>
          <Input
            {...register("password")}
            id="password"
            type="password"
            placeholder="Enter admin password"
            className="h-12 border-[#E5E5E8]"
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#2A2A3C] hover:bg-[#1F1F2E] text-white font-medium"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </div>
  );
}
