import axios from "axios";

const API = "http://localhost:8080/companies";

const api = axios.create({
    baseURL: API
});

api.interceptors.request.use(config => {

    const token = localStorage.getItem("token");

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});

// Existing
export const getCompanies = () =>
    api.get("");

// NEW
export const getAvailableCompanies = (ownerId) => {

    if (ownerId) {

        return api.get(`/available?ownerId=${ownerId}`);

    }

    return api.get("/available");

};

export const createCompany = (company) =>
    api.post("", company);

export const updateCompany = (id, company) =>
    api.put(`/${id}`, company);

export const deleteCompany = (id) =>
    api.delete(`/${id}`);