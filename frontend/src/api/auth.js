import API from "./axios";

export const registerUser = async (userData) => {
  try {
    const response = await API.post("/user/register/", userData);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { error: "Something went wrong" };
  }
};
