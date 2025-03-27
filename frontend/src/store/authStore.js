import { create } from "zustand";
import axiosInstance from "../api/axios";

const useAuthStore = create((set) => {
  // Initialize from localStorage
  const initializeAuth = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const isAuthenticated = !!accessToken && tokenExpiry && new Date(tokenExpiry) > new Date();
    
    return {
      token: accessToken,
      refreshToken,
      tokenExpiry: tokenExpiry ? new Date(tokenExpiry) : null,
      isAuthenticated
    };
  };

  return {
    ...initializeAuth(),

    setTokens: (access, refresh, expiresIn = 3600) => {
      const expiryDate = new Date(new Date().getTime() + expiresIn * 1000);
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("tokenExpiry", expiryDate.toISOString());
      
      set({ 
        token: access,
        refreshToken: refresh,
        tokenExpiry: expiryDate,
        isAuthenticated: true 
      });
      
      // Set timeout to logout 1 minute before token expires
      setTimeout(() => {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }, (expiresIn - 60) * 1000);
    },

    refreshAccessToken: async () => {
      try {
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await axiosInstance.post("/user/token/refresh/", {
          refresh: refreshToken
        });

        if (response.data.access) {
          useAuthStore.getState().setTokens(
            response.data.access,
            refreshToken, // Keep same refresh token
            3600 // Default expiration time
          );
          return response.data.access;
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        useAuthStore.getState().logout();
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiry");
      set({ 
        token: null,
        refreshToken: null,
        tokenExpiry: null,
        isAuthenticated: false 
      });
    }
  };
});

export default useAuthStore;