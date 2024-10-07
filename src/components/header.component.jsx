import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Импортируем библиотеку для работы с куками

function Header({ username, onLogout}) {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const dropdownRef = useRef(null); // Ссылка на выпадающее меню

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setModalOpen(true);
  };

  const confirmLogout = () => {
    setModalOpen(false);
    navigate('/');
    Cookies.remove('token'); // Удаляем токен из куков
    onLogout(); // Вызываем функцию выхода
  };

  const cancelLogout = () => {
    setModalOpen(false); // Закрываем модальное окно
  };

  // Обработчик для закрытия выпадающего списка при клике вне его зоны
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Закрываем меню
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
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
            <Link to="/atlas" className="text-white text-decoration-none me-1 ms-3">Атлас</Link>
            <Link to="/collection" className="text-white text-decoration-none me-1 ms-3">Коллекция</Link>
            <Link to="/articles" className="text-white text-decoration-none me-1 ms-3">Статьи</Link>
            <Link to="/news" className="text-white text-decoration-none me-1 ms-3">Новости</Link>
            <Link to="/contacts" className="text-white text-decoration-none me-1 ms-3">Контакты</Link>
            {username ? (
              <div className="dropdown ms-1" ref={dropdownRef}>
              <button 
                className="btn btn-link text-white text-decoration-none dropdown-toggle" 
                type="button" 
                onClick={toggleDropdown}
                id="userDropdown" 
                aria-expanded={isDropdownOpen}
              >
                {username}
              </button>
              <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="userDropdown">
                <li>
                  <Link to="/cabinet" onClick={toggleDropdown} className="dropdown-item">Личный кабинет</Link>
                </li>
                <li>
                  <button onClick={() => { toggleDropdown(); handleLogout(); }} className="dropdown-item">Выйти</button>
                </li>
              </ul>
            </div>
            ) : (
            <Link to="/auth" className="text-white text-decoration-none text-nowrap ms-3">Личный кабинет</Link>
            )}
          </nav>
        </div>
      </header>

      {isModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }} aria-modal="true" role="dialog">
          <div className="modal-dialog" style={{ marginTop: '12rem' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Подтверждение выхода</h5>
                <button type="button" className="btn-close" onClick={cancelLogout}></button>
              </div>
              <div className="modal-body">
                <p>Вы уверены, что хотите выйти?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelLogout}>Отмена</button>
                <button type="button" className="btn btn-danger" onClick={confirmLogout}>Выйти</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && <div className="modal-backdrop fade show"></div>}
    </>
  );
}

export default Header;
