import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import './App.css';

import api from "./conf/api";
import Header from './components/header.component';
import Login from './pages/login.page';
import Cabinet from './pages/cabinet.page';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = Cookies.get('UserData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    Cookies.set('UserData', JSON.stringify(userData)); // Сохраняем информацию о пользователе в куке
  };

  const handleLogout = async () => {
    try {
      const response = await api.post('/auth/logout');
      setUser(null);
      Cookies.remove('UserData'); // Удаляем куку при выходе
    } catch (error) {
      error.message;
    }
    

  };

  return (
    <div>
      <Router>
        <Header user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/auth" element={<Login onLogin={handleLogin} />}/>
          <Route path="/cabinet" element={<Cabinet />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
