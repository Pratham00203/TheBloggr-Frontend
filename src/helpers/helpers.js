import axios from "axios";

const checkAuth = () => {
  return localStorage.getItem("token") ? true : false;
};

const getUser = async () => {
  try {
    const res = await axios.get("/auth/login");
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    return errors;
  }
};

const logout = () => {
  localStorage.removeItem("token");
};

export { checkAuth, getUser, logout };
