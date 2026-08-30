import api from "../api/axios";

export const uploadProfilePicture = (file) => {

    const formData = new FormData();

    formData.append("file", file);

    return api.post(
        "/upload/profile-picture",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

};