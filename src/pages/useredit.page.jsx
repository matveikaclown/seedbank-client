import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../conf/api';

function EditUser({ onLogin }) {
    const { login } = useParams();
    const [user, setUser] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [isPasswordChanging, setIsPasswordChanging] = useState(false);
    const [error, setError] = useState("");
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    
    const handleEditClick = () => setIsEditable(true);
    const handleCancelClick = () => setIsEditable(false);
    const handlePasswordChangeClick = () => setIsPasswordChanging(true);
    const handleCancelPasswordChange = () => setIsPasswordChanging(false);

    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/user/${login}`)
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке данных пользователя:", error);
                setError("Не удалось загрузить данные пользователя.");
            });
    }, [login]);

    const handleSaveClick = () => {
        api.patch(`/user/update?login=${login}`, user)
            .then((response) => {
                if (response.data) {
                    console.table(response)
                    const userData = {
                        login: response.data.login,
                        username: response.data.username,
                        r: response.data.rl
                    };

                    onLogin(userData);
                }
                alert("Данные успешно сохранены!");
                setIsEditable(false);
                navigate(`/cabinet/edit-user/${user.login}`)
            })
            .catch((error) => {
                console.error("Ошибка при сохранении данных:", error);
                setError("Не удалось сохранить данные.");
            });
    };

    const handleDeleteClick = () => {
        const confirmDelete = window.confirm("Вы уверены, что хотите удалить этого пользователя?");
        if (confirmDelete) {
            api.delete(`/user/delete?login=${login}`)
                .then(() => {
                    alert("Пользователь успешно удален!");
                    navigate(`/cabinet`)
                })
                .catch((error) => {
                    console.error("Ошибка при удалении:", error);
                    alert("Не удалось удалить пользователя.");
                });
        }
    };

    const handlePasswordSaveClick = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        }

        api.patch(`/user/update?login=${login}`, {
            password: passwordData.newPassword
        })
            .then(() => {
                alert("Пароль успешно изменен!");
                setIsPasswordChanging(false);
                setPasswordData({ newPassword: "", confirmPassword: "" });
            })
            .catch((error) => {
                console.error("Ошибка при изменении пароля:", error);
                setError("Не удалось изменить пароль.");
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === "isActive" ? value === "true" : value;
        setUser((prevUser) => ({ ...prevUser, [name]: newValue }));
    };

    const handlePasswordDataChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prevData) => ({ ...prevData, [name]: value }));
    };

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Редактирование пользователя: {login}</h2>
            {error && <p className="text-danger">{error}</p>}
            <form>
                {!isPasswordChanging ? (
                    <>
                        <div className="mb-3">
                            <label className="form-label">Логин</label>
                            <input
                                type="text"
                                className="form-control"
                                name="login"
                                value={user.login}
                                onChange={handleChange}
                                disabled={!isEditable}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Имя</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                disabled={!isEditable}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Фамилия</label>
                            <input
                                type="text"
                                className="form-control"
                                name="surname"
                                value={user.surname}
                                onChange={handleChange}
                                disabled={!isEditable}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Отчество</label>
                            <input
                                type="text"
                                className="form-control"
                                name="patronymic"
                                value={user.patronymic}
                                onChange={handleChange}
                                disabled={!isEditable}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Активен</label>
                            <select
                                className="form-select"
                                name="isActive"
                                value={user.isActive ? "true" : "false"}
                                onChange={handleChange}
                                disabled={!isEditable}
                            >
                                <option value="true">Да</option>
                                <option value="false">Нет</option>
                            </select>
                        </div>   
                    </>
                ) : (
                    <>
                        <div className="mb-3">
                            <label className="form-label">Новый пароль</label>
                            <input
                                type="password"
                                className="form-control"
                                name="newPassword"
                                onChange={handlePasswordDataChange}
                                disabled={!isPasswordChanging}
                                value={passwordData.newPassword}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Подтверждение пароля</label>
                            <input
                                type="password"
                                className="form-control"
                                name="confirmPassword"
                                onChange={handlePasswordDataChange}
                                disabled={!isPasswordChanging}
                                value={passwordData.confirmPassword}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-success equal-btn"
                            onClick={handlePasswordSaveClick}
                        >
                            Сохранить
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary ms-2 equal-btn"
                            onClick={handleCancelPasswordChange}
                        >
                            Отмена
                        </button>
                    </>
                )}           

                <div className="d-flex justify-content-between">
                    {isEditable && (
                        <>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-success me-2 equal-btn"
                                    onClick={handleSaveClick}
                                >
                                    Сохранить
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary equal-btn"
                                    onClick={handleCancelClick}
                                >
                                    Отмена
                                </button>
                            </div>
                            <button
                                type="button"
                                className="btn btn-danger ms-auto equal-btn"
                                onClick={handleDeleteClick}
                            >
                                Удалить
                            </button>
                        </>
                    )} 
                    {!isPasswordChanging && !isEditable && (
                        <>
                            <button
                                type="button"
                                className="btn btn-primary equal-btn"
                                onClick={handleEditClick}
                            >
                                Редактировать
                            </button>
                            <button
                                type="button"
                                className="btn btn-warning ms-2 equal-btn"
                                onClick={handlePasswordChangeClick}
                            >
                                Изменить пароль
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}

export default EditUser;
