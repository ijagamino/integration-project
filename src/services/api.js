import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Ensure the backend server URL is correct.
});

export default api;
