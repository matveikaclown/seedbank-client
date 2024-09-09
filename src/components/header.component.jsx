import React from "react";

function Header() {
    return (
      <header style={{ backgroundColor: '#0d47a1' }} className="text-white py-2 d-flex align-items-center">
        <div className="container d-flex justify-content-between align-items-center h-100">
          <div className="d-flex align-items-center h-100">
            <img 
              src="/images/logo-white-goriz.svg" 
              alt="Logo" 
              className="me-5" 
              style={{ height: '3rem', width: 'auto' }}
            />
          </div>
          <nav>
            <a href="atlas" className="text-white text-decoration-none me-3">Атлас</a>
            <a href="collection" className="text-white text-decoration-none me-3">Коллекция</a>
            <a href="articles" className="text-white text-decoration-none me-3">Статьи</a>
            <a href="news" className="text-white text-decoration-none me-3">Новости</a>
            <a href="contacts" className="text-white text-decoration-none me-3">Контакты</a>
            <a href="cabinet" className="text-white text-decoration-none">Личный кабинет</a>
          </nav>
        </div>
      </header>
    );
  }

export default Header
