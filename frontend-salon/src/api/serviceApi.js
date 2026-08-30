import axios from "axios";

const API_URL = "http://localhost:8080";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// =========================================================
// AUTHORIZATION
// =========================================================

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("salonToken");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// =========================================================
// GET SERVICES BY COMPANY
// =========================================================

export const getServicesByCompany = async (companyId) => {
    const response = await api.get(
        `/services/company/${companyId}`
    );

    return response.data;
};

// =========================================================
// GET SERVICE BY ID
// =========================================================

export const getServiceById = async (id) => {
    const response = await api.get(
        `/services/${id}`
    );

    return response.data;
};

// =========================================================
// CREATE SERVICE
// =========================================================

export const createService = async (data) => {
    const response = await api.post(
        "/services",
        data
    );

    return response.data;
};

// =========================================================
// UPDATE SERVICE
// =========================================================

export const updateService = async (id, data) => {
    const response = await api.put(
        `/services/${id}`,
        data
    );

    return response.data;
};

// =========================================================
// DELETE SERVICE
// =========================================================

export const deleteService = async (id) => {
    await api.delete(
        `/services/${id}`
    );
};

// =========================================================
// CHECK SERVICE AVAILABILITY
// =========================================================

export const checkServiceAvailability = async (id) => {
    const response = await api.get(
        `/services/${id}/availability`
    );

    return response.data;
};

// =========================================================
// DEFAULT API
// =========================================================

export default api;