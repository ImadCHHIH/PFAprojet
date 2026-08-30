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

        const token =
            localStorage.getItem("salonToken");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// =========================================================
// GET PROMO CODES BY COMPANY
// =========================================================

const getByCompany = async (
    companyId
) => {

    const response = await api.get(
        `/api/promo-codes/company/${companyId}`
    );

    return response.data;
};

// =========================================================
// GET PROMO CODE BY ID
// =========================================================

const getById = async (
    id
) => {

    const response = await api.get(
        `/api/promo-codes/${id}`
    );

    return response.data;
};

// =========================================================
// CREATE
// =========================================================

const create = async (
    data
) => {

    const response = await api.post(
        "/api/promo-codes",
        data
    );

    return response.data;
};

// =========================================================
// UPDATE
// =========================================================

const update = async (
    id,
    data
) => {

    const response = await api.put(
        `/api/promo-codes/${id}`,
        data
    );

    return response.data;
};

// =========================================================
// DELETE
// =========================================================

const remove = async (
    id
) => {

    await api.delete(
        `/api/promo-codes/${id}`
    );
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

const promoCodeApi = {

    getByCompany,
    getById,
    create,
    update,

    // Allows promoCodeApi.delete()
    delete: remove,

};

export default promoCodeApi;