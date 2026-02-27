import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5032/api", // ✅ Vercel environment variable
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = "Bearer " + token; // ✅ Attach JWT token if exists
  return req;
});

export default api;
