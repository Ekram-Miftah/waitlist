import axios from "axios";
import { Buffer } from "buffer"; // Required for Basic Auth Base64 encoding

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface WaitlistEntry {
  id: number;
  email: string;
  signup_date: string;
}

// --- Utility: Get Basic Auth Header from Credentials (Used in Login) ---
// 🚨 NEW: Creates the 'Authorization: Basic ...' header using user-provided credentials.
function getAuthHeaderFromCredentials(email: string, password: string) {
  const credentials = `${email}:${password}`;
  const base64Credentials = Buffer.from(credentials).toString("base64");
  return {
    Authorization: `Basic ${base64Credentials}`,
  };
}

// --- Utility: Get Auth Header from Store (Used in Protected Routes) ---
// 🚨 NEW: Gets the full 'Authorization: Basic ...' string stored in local storage.
function getAuthHeaderFromStore() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  // The stored token already contains the 'Basic ' prefix.
  return token ? { Authorization: token } : {};
}

export async function signupToWaitlist(
  email: string
): Promise<{ success: boolean; message: string }> {
  if (!API_BASE_URL) {
    return { success: false, message: "API URL not configured." };
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/signup`, {
      email,
    });

    if (response.status === 201) {
      return {
        success: true,
        message: "Success! Confirmation email sent. Check your inbox.",
      };
    }

    return { success: false, message: "An unexpected status was returned." };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 409) {
        return {
          success: false,
          message: "This email is already on the waitlist.",
        };
      }
      return {
        success: false,
        message: error.response.data?.detail || "API Error: Could not sign up.",
      };
    }
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
}

export async function adminLogin(data: {
  email: string;
  password: string;
}): Promise<{ success: boolean; token?: string; message?: string }> {
  if (!API_BASE_URL) {
    return { success: false, message: "API URL not configured." };
  }

  try {
    // 🚨 CRITICAL FIX 1: Use the correct, existing login endpoint from main.py.
    // 🚨 CRITICAL FIX 2: Send the credentials in the Basic Auth Header, not the body.
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/admin/login`,
      {}, // Basic Auth does not require a request body for this endpoint
      {
        headers: getAuthHeaderFromCredentials(data.email, data.password),
      }
    );

    // Your backend returns a 'token' and 'message' on success.
    if (response.status === 200 && response.data.token) {
      // Store the FULL Basic Auth header string for future requests.
      const fullAuthToken = getAuthHeaderFromCredentials(
        data.email,
        data.password
      ).Authorization;

      return {
        success: true,
        token: fullAuthToken, // Store the full Basic Auth string
        message: "Login successful.",
      };
    }

    return { success: false, message: "Login failed: Missing session data." };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        return { success: false, message: "Invalid admin credentials." };
      }
      return {
        success: false,
        message: error.response.data?.detail || "API Error: Could not log in.",
      };
    }
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
}

export async function fetchWaitlistEntries(): Promise<WaitlistEntry[]> {
  if (!API_BASE_URL) return [];

  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/waitlist`, {
      // 🚨 FIX: Use the Basic Auth header stored during login
      headers: getAuthHeaderFromStore(),
    });

    const sortedEntries = response.data.sort(
      (a: WaitlistEntry, b: WaitlistEntry) => {
        return (
          new Date(a.signup_date).getTime() - new Date(b.signup_date).getTime()
        );
      }
    );
    return sortedEntries;
  } catch (error) {
    console.error("Error fetching waitlist entries:", error);
    return [];
  }
}

export function calculateStats(entries: WaitlistEntry[]) {
  if (entries.length === 0) {
    return { total_signups: 0, new_this_week: 0, estimated_wait_time: "N/A" };
  }

  const total_signups = entries.length;
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const new_this_week = entries.filter((entry) => {
    const entryDate = new Date(entry.signup_date);
    return entryDate >= oneWeekAgo;
  }).length;

  let estimated_wait_time = "1-2 Weeks";
  if (total_signups >= 500) estimated_wait_time = "2-3 Weeks";
  if (total_signups >= 1000) estimated_wait_time = "3-4 Weeks";

  return { total_signups, new_this_week, estimated_wait_time };
}

export function calculateAnalytics(entries: WaitlistEntry[]) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const thisWeekSignups = entries.filter((entry) => {
    const signupDate = new Date(entry.signup_date.replace(" ", "T"));
    return signupDate >= oneWeekAgo && signupDate <= now;
  }).length;

  const lastWeekSignups = entries.filter((entry) => {
    const signupDate = new Date(entry.signup_date.replace(" ", "T"));
    return signupDate >= twoWeeksAgo && signupDate < oneWeekAgo;
  }).length;

  const weeklyGrowth =
    lastWeekSignups > 0
      ? ((thisWeekSignups - lastWeekSignups) / lastWeekSignups) * 100
      : 0;
  const avgDailySignups = thisWeekSignups / 7;

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const daySignups = entries.filter((entry) => {
      const signupDate = new Date(entry.signup_date.replace(" ", "T"));
      return signupDate.toDateString() === date.toDateString();
    }).length;
    return { day: dayName, signups: daySignups };
  });

  const signupTrendData = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(
      now.getTime() - (7 - i) * 7 * 24 * 60 * 60 * 1000
    );
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekSignups = entries.filter((entry) => {
      const signupDate = new Date(entry.signup_date.replace(" ", "T"));
      return signupDate >= weekStart && signupDate < weekEnd;
    }).length;
    const dateLabel = weekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return { date: dateLabel, signups: weekSignups };
  });

  return {
    thisWeekSignups,
    lastWeekSignups,
    weeklyGrowth,
    avgDailySignups,
    weeklyData,
    signupTrendData,
  };
}
