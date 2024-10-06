import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Импортируем библиотеку для работы с куками

function Header({ username, onLogout}) {
  const navigate = useNavigate();

  const handleLogout = () => {
      if (window.confirm("Вы уверены, что хотите выйти?")) {
      navigate('/');
      Cookies.remove('token'); // Удаляем токен из куков
      onLogout();
    }
  };

  return (
    <header style={{ backgroundColor: '#0d47a1' }} className="text-white py-2 d-flex align-items-center">
      <div className="container d-flex justify-content-between align-items-center h-100">
        <div className="d-flex align-items-center h-100">
          <Link to="/" className="text-white text-decoration-none">
          <img 
            src="/images/logo-white-goriz.svg" 
            alt="Logo" 
            className="me-5" 
            style={{ height: '3rem', width: 'auto' }}
          />
          </Link>
        </div>
        <nav className="d-flex flex-wrap align-items-center">
          <Link to="/atlas" className="text-white text-decoration-none me-3">Атлас</Link>
          <Link to="/collection" className="text-white text-decoration-none me-3">Коллекция</Link>
          <Link to="/articles" className="text-white text-decoration-none me-3">Статьи</Link>
          <Link to="/news" className="text-white text-decoration-none me-3">Новости</Link>
          <Link to="/contacts" className="text-white text-decoration-none me-3">Контакты</Link>
          {username ? (
            <>
              <Link to="/cabinet" className="text-white text-decoration-none me-3">{username}</Link>
              <div className="position-relative">
                <button onClick={handleLogout} className="btn btn-danger">Выйти</button>
              </div>
            </>
          ) : (
          <Link to="/auth" className="text-white text-decoration-none text-nowrap">Личный кабинет</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
