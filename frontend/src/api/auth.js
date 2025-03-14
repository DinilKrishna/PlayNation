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
    const response = await fetch("http://127.0.0.1:8000/api/user/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("API Response:", data); // Debugging

    if (!response.ok) {
      throw new Error(data.detail || "Invalid credentials.");
    }

    return data; // Return full response
  } catch (error) {
    console.error("Login Error:", error.message);
    return { error: error.message };
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
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    useAuthStore.getState().logout();
  }
};
