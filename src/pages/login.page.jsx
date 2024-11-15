import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from "../conf/api";
import 'bootstrap-icons/font/bootstrap-icons.css';

function Login({ onLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Вход";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/sign-in", { login, password });
      const userData = {
        login: response.data.login,
        username: response.data.username,
        r: response.data.rl
      };

      onLogin(userData);
      navigate('/cabinet'); // Перенаправляем пользователя на страницу кабинета
    } catch (error) {
      setError('Неверный логин или пароль');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="card p-4 shadow" style={{ minWidth: '400px' }}>
        <h3 className="text-center mb-4">Авторизация</h3>
        <form onSubmit={handleSubmit} className="v-form">
          <div className="mb-3">
            <label className="form-label">Логин</label>
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                value={login} 
                onChange={(e) => setLogin(e.target.value)} 
                required 
                placeholder="Введите логин"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Пароль</label>
            <div className="input-group">
              <input 
                type={showPassword ? "text" : "password"}
                className="form-control" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Введите пароль"
              />
              <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
              </span>
            </div>
          </div>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <div className="text-center">
            <button type="submit" className="btn btn-primary w-100">
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
