import API from "./axios";
import useAuthStore from "../store/authStore";

export const registerUser = async (userData) => {
  try {
    const response = await API.post("/user/register/", userData);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { error: "Something went wrong" };
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await API.post("/user/login/", formData);
    console.log("API Response:", response.data); // Debugging

    if (response.status === 200) {
      const { access, refresh } = response.data;
      useAuthStore.getState().setToken(access, refresh);
      return response.data;
    }
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    return { error: error.response?.data?.detail || "Invalid credentials." };
  }
};

export const logoutUser = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await API.post("/user/logout/", { refresh_token: refreshToken });
    }
  } catch (error) {
    console.error("Logout Error:", error.response?.data || "Something went wrong");
  } finally {
    useAuthStore.getState().logout();
  }
};
