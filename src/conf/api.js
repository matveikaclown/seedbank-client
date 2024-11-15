import Cookies from "js-cookie";

import axios from "axios";

// Создаем экземпляр Axios
const api = axios.create({
    baseURL: "http://localhost:8080/api", // Замените на URL вашего API
    withCredentials: true // Чтобы автоматически отправлялись куки
});

// Добавляем интерцептор ответов
api.interceptors.response.use(
    (response) => response, // Успешный ответ возвращается как есть
    async (error) => {
        if (error.response && error.response.status === 403) {
            try {
                // Отправляем запрос на обновление токенов
                await api.post("/auth/refresh");

                // Повторяем исходный запрос
                return api.request(error.config);
            } catch (refreshError) {
                // Если обновить токены не удалось, перенаправляем на страницу логина
                Cookies.remove('UserData');
                window.location.href = "/auth";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error); // Обработка других ошибок
    }
);

export default api; // Экспортируем настроенный клиент
