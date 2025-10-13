"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { waitlistSchema, type WaitlistFormData } from "@/lib/schemas"
import { signupToWaitlist } from "@/lib/api"

export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  })

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true)
    setMessage(null)

    const result = await signupToWaitlist(data.email)

    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    })

    if (result.success) {
      reset()
    }

    setIsSubmitting(false)
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <Input
          {...register("email")}
          type="email"
          placeholder="Enter your email address"
          className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 px-8 bg-[#C9A88A] hover:bg-[#B89878] text-white font-medium"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            "Secure Your Place"
          )}
        </Button>
      </form>

      {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/20 text-green-200 border border-green-500/30"
              : "bg-red-500/20 text-red-200 border border-red-500/30"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  )
}
