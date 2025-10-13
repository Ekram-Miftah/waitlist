import { z } from "zod";

// Schema for the Public Waitlist Form
export const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export type WaitlistFormData = z.infer<typeof waitlistSchema>;

// Schema for the Admin Login Form
export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required."),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
