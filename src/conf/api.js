import Cookies from "js-cookie";

import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

// Создаем экземпляр Axios
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

// Добавляем интерцептор ответов
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (window.location.pathname === "/auth") {
            return Promise.reject(error); 
        }

        if (error.response && error.response.status === 403) {
            try {
                await api.post("/auth/refresh");

                // Повторяем исходный запрос
                return api.request(error.config);
            } catch (refreshError) {
                Cookies.remove('UserData');
                window.location.href = "/auth";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
