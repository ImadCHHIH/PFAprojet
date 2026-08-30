import axios from "axios";

const API_URL = "http://localhost:8080";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("salonToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// =========================================================
// GET APPOINTMENTS BY COMPANY
// =========================================================

const getByCompany = async (companyId) => {

    const response = await api.get(
        `/api/appointments/company/${companyId}`
    );

    return response.data;
};

// =========================================================
// GET APPOINTMENT BY ID
// =========================================================

const getById = async (id) => {

    const response = await api.get(
        `/api/appointments/${id}`
    );

    return response.data;
};

// =========================================================
// CREATE
// =========================================================

const create = async (data) => {

    const response = await api.post(
        "/api/appointments",
        data
    );

    return response.data;
};

// =========================================================
// UPDATE
// =========================================================

const update = async (id, data) => {

    const response = await api.put(
        `/api/appointments/${id}`,
        data
    );

    return response.data;
};

// =========================================================
// DELETE
// =========================================================

const remove = async (id) => {

    await api.delete(
        `/api/appointments/${id}`
    );
};

// =========================================================
// UPDATE STATUS
// =========================================================

export const updateStatus = async (id, status) => {
    const response = await api.patch(
        `/api/appointments/${id}/status`,
        {
            status: status
        }
    );

    return response.data;
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

const appointmentsApi = {

    getByCompany,
    getById,
    create,
    update,

    // Page uses appointmentsApi.delete()
    delete: remove,

    updateStatus,

};

export default appointmentsApi;