import axios from "axios";

const API = "http://localhost:8080/plans";

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

export const getPlans = () => api.get("");

export const createPlan = (plan) =>
    api.post("", plan);

export const updatePlan = (id, plan) =>
    api.put(`/${id}`, plan);

export const deletePlan = (id) =>
    api.delete(`/${id}`);