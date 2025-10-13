import { create } from "zustand";

// State definition
interface AuthState {
  // 🚨 FIX 1: Correctly define the setToken function signature (fixes the TypeError)
  setToken: (token: string) => void;

  token: string | null; // Stores the 'Bearer [jwt_token]'
  isAuthenticated: boolean;

  logout: () => void;
}

// Check for the token in localStorage on initialization
const initialToken =
  typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

export const useAuthStore = create<AuthState>((set) => ({
  // Initialize state from localStorage
  token: initialToken,
  isAuthenticated: !!initialToken,

  // 🚨 FIX 2: Implement the setToken action (fixes the TypeError)
  setToken: (token) => {
    localStorage.setItem("adminToken", token);
    set({ token, isAuthenticated: true });
  },

  // Function for logging out
  logout: () => {
    localStorage.removeItem("adminToken");
    set({ token: null, isAuthenticated: false });
  },
}));
