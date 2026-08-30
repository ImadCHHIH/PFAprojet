import api from "../api/axios";

// Get all subscriptions
export const getSubscriptions = () =>
    api.get("/subscriptions");

// Get one subscription
export const getSubscription = (id) =>
    api.get(`/subscriptions/${id}`);

// Create
export const createSubscription = (subscription) =>
    api.post("/subscriptions", subscription);

// Update
export const updateSubscription = (id, subscription) =>
    api.put(`/subscriptions/${id}`, subscription);

// Cancel (instead of delete)
export const cancelSubscription = (id) =>
    api.put(`/subscriptions/${id}/cancel`);

// Renew
export const renewSubscription = (id, planId, durationMonths) => {

    console.log("Renew payload:", {
        id,
        planId,
        durationMonths
    });

    return api.put(`/subscriptions/${id}/renew`, {
        planId,
        durationMonths
    });

};