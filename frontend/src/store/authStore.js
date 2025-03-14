import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("accessToken") || null, // Load from localStorage
  isAuthenticated: !!localStorage.getItem("accessToken"),
  
  setToken: (newToken) => {
    localStorage.setItem("accessToken", newToken);
    set({ token: newToken, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;