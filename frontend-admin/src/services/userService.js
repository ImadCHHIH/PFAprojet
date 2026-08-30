import api from "../api/axios";

export const getUsers = () =>
    api.get("/users");

export const getUser = (id) =>
    api.get(`/users/${id}`);

export const createUser = (user) =>
    api.post("/users", user);

export const updateUser = (id, user) =>
    api.put(`/users/${id}`, user);

export const toggleUserStatus = (id) =>
    api.put(`/users/${id}/toggle-status`);