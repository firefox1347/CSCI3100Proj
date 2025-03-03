import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5050/api/v1",
    withCredentials: true,

});