import api from "./api";


export const register = (data) => {
    return api
        .post("/auth/register", data)
        .then((response) => response.data);
};


export const login = (data) => {
    return api
        .post("/auth/login", data)
        .then((response) => response.data);
};


export const forgotPassword = (email) => {
    return api
        .post(
            "/auth/forgot-password",
            {
                email: email
            }
        )
        .then((response) => response.data);
};


export const resetPassword = (data) => {
    return api
        .post(
            "/auth/reset-password",
            data
        )
        .then((response) => response.data);
};