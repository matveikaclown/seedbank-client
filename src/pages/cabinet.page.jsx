import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../conf/api';

function Cabinet() {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [greeting, setGreeting] = useState("");
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        login: "",
        name: "",
        surname: "",
        patronymic: "",
        password: ""
    });
    const [formError, setFormError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const userData = Cookies.get("UserData");
        if (userData) {
            try {
                const parsedData = JSON.parse(userData);
                setUsername(parsedData.username);
                setRole(parsedData.r);
            } catch (error) {
                console.error("Error while parsing UserData: ", error);
            }
        }

        const hour = new Date().getHours();
        if (hour >= 4 && hour < 12) {
            setGreeting("Доброе утро");
        } else if (hour >= 12 && hour < 17) {
            setGreeting("Добрый день");
        } else if (hour >= 17 && hour < 22) {
            setGreeting("Добрый вечер");
        } else {
            setGreeting("Доброй ночи");
        }
    }, []);

    useEffect(() => {
        if (role === "su") {
            fetchUsers(currentPage);
        }
    }, [role, currentPage]);

    const fetchUsers = (page) => {
        setUsers([])
        api.get(`/user/all?page=${page}`)
            .then((response) => {
                console.log(response.data);
                setUsers(response.data.content);
                setTotalPages(response.data.totalPages);
                setError("");
            })
            .catch((error) => {
                console.error("Ошибка при получении списка пользователей:", error);
                setError("Не удалось загрузить список пользователей.");
            });
    };

    const handleRowClick = (login) => {
        navigate(`/cabinet/edit-user/${login}`);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setFormError("");
        setFormData({
            login: "",
            name: "",
            surname: "",
            patronymic: "",
            password: ""
        });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const { login, name, password, confirmPassword } = formData;

        if (!login || !name || !password || !confirmPassword) {
            setFormError("Пожалуйста, заполните все обязательные поля.");
            return;
        }

        if (password !== confirmPassword) {
            setFormError("Пароли не совпадают.");
            return;
        }

        try {
            await api.post(`/user/add`, formData);
            setFormError("");
            handleCloseModal();
            fetchUsers(currentPage);
        } catch (error) {
            console.error("Ошибка при добавлении пользователя:", error);
            setFormError("Не удалось добавить пользователя.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>
                {greeting}, {username}!
            </h2>
            {role === "su" && (
                <div className="mt-4">
                    <h3>Управление пользователями</h3>
                    {error ? (
                        <p className="text-danger">{error}</p>
                    ) : (
                        <div>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Логин</th>
                                        <th>Имя</th>
                                        <th>Фамилия</th>
                                        <th>Отчество</th>
                                        <th>Активен</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr
                                            key={user.login}
                                            onClick={() => handleRowClick(user.login)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <td>{user.login}</td>
                                            <td>{user.name}</td>
                                            <td>{user.surname}</td>
                                            <td>{user.patronymic}</td>
                                            <td>{user.isActive ? "Да" : "Нет"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    className="btn btn-primary equal-btn"
                                    disabled={currentPage === 0}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    Назад
                                </button>
                                <button
                                    className="btn btn-primary equal-btn"
                                    disabled={currentPage + 1 === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    Вперёд
                                </button>
                                <span>
                                    Страница {currentPage + 1} из {totalPages}
                                </span>
                            </div>
                        </div>
                    )}
                    <button
                        className="btn btn-success mt-3 equal-btn"
                        onClick={handleOpenModal}
                    >
                        Добавить пользователя
                    </button>
                </div>
            )}
            {isModalOpen && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Добавить пользователя</h5>
                                <button className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                {formError && <p className="text-danger">{formError}</p>}
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Логин*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="login"
                                            value={formData.login}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Имя*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Фамилия</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="surname"
                                            value={formData.surname}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Отчество</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="patronymic"
                                            value={formData.patronymic}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Пароль*</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Подтверждение пароля*</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleCloseModal}>
                                    Закрыть
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    Добавить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cabinet;