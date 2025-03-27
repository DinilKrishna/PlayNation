  import { create } from "zustand";

  const useAuthStore = create((set) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const isAuthenticated = !!accessToken;

    const refreshAccessToken = async () => {
      try {
        const storedRefreshToken = localStorage.getItem("refreshToken");
        if (!storedRefreshToken) return null;
  
        const response = await axios.post("http://127.0.0.1:8000/api/user/token/refresh/", {
          refresh: storedRefreshToken,
        });
  
        if (response.status === 200) {
          const newAccessToken = response.data.access;
          localStorage.setItem("accessToken", newAccessToken);
          set({ token: newAccessToken, isAuthenticated: true });
          return newAccessToken;
        }
      } catch (error) {
        console.error("Error refreshing token:", error.response?.data || error.message);
        useAuthStore.getState().logout();
      }
      return null;
    };
  
    return {
      token: accessToken,
      isAuthenticated,
  
      setToken: (newAccessToken, newRefreshToken) => {
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        set({ token: newAccessToken, isAuthenticated: true });
      },
  
      refreshAccessToken,
  
      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ token: null, isAuthenticated: false });
      },
    };
  });
  
  export default useAuthStore;
