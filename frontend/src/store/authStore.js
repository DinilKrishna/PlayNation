import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("accessToken") || null, // Load from localStorage
  setToken: (newToken) => {
    localStorage.setItem("accessToken", newToken);
    set({ token: newToken });
  },
  clearToken: () => {
    localStorage.removeItem("accessToken");
    set({ token: null });
  },
}));

export default useAuthStore;
