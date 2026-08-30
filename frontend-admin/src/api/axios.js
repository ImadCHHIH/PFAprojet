import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    // Don't send JWT when logging in
    if (token && !config.url.startsWith("/auth")) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {

        // Only logout if the token is invalid or expired
        if (error.response?.status === 401) {

            localStorage.removeItem("token");

            // Prevent redirect loop
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;