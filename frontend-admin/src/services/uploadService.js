import api from "../api/axios";

export const uploadLogo = (file) => {

    const formData = new FormData();

    formData.append("file", file);

    return api.post("/api/upload/logo", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

};

export const uploadProfilePicture = (file) => {

    const formData = new FormData();

    formData.append("file", file);

    return api.post("/api/upload/profile-picture", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

};