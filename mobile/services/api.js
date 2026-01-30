import axios from "axios";

const API = axios.create({
  baseURL: "http://172.20.6.125:8000/api", // NOT localhost on mobile
  timeout: 5000,
});

export default API;
