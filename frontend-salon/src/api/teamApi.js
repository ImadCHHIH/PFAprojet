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
// GET TEAM BY COMPANY
// =========================================================

export const getTeamByCompany = async (companyId) => {
    const response = await api.get(
        `/api/team/company/${companyId}`
    );

    return response.data;
};

// =========================================================
// GET TEAM MEMBER BY ID
// =========================================================

export const getTeamMemberById = async (id) => {
    const response = await api.get(
        `/api/team/${id}`
    );

    return response.data;
};

// =========================================================
// CREATE TEAM MEMBER
// =========================================================

export const createTeamMember = async (data) => {
    const response = await api.post(
        "/api/team",
        data
    );

    return response.data;
};

// =========================================================
// UPDATE TEAM MEMBER
// =========================================================

export const updateTeamMember = async (id, data) => {
    const response = await api.put(
        `/api/team/${id}`,
        data
    );

    return response.data;
};

// =========================================================
// DELETE TEAM MEMBER
// =========================================================

export const deleteTeamMember = async (id) => {
    await api.delete(
        `/api/team/${id}`
    );
};

// =========================================================
// UPDATE DUTY STATUS
// =========================================================

export const updateDutyStatus = async (
    id,
    status
) => {
    const response = await api.patch(
        `/api/team/${id}/duty-status`,
        null,
        {
            params: {
                status,
            },
        }
    );

    return response.data;
};

// =========================================================
// DEFAULT API
// =========================================================

export default api;