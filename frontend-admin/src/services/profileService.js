import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/users"
});

api.interceptors.request.use(config => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

export const getMyProfile = () =>
    api.get("/me");

export const updateMyProfile = (profile) =>
    api.put("/me", profile);

export const changePassword = (passwords) =>
    api.put("/change-password", passwords);