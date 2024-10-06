import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Cookies from 'js-cookie'
import './App.css'
import Header from './components/header.component'
import Login from './pages/login.page'
import Cabinet from './pages/cabinet.page'

function App() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token'); // Проверяем наличие токена в cookie
    if (token) {
      const parsedToken = JSON.parse(atob(token.split('.')[1])); // Декодируем токен
      setUsername(parsedToken.login); // Устанавливаем имя пользователя из токена
    }
  }, []);

  const handleLogin = (user) => {
    setUsername(user);
  };

  const handleLogout = () => {
    setUsername(null);
  };

  return (
    <div>
      <Router>
      <Header username={username} onLogout={handleLogout}/>
      <Routes>
        <Route path="/auth" element={<Login onLogin={handleLogin}/>}></Route>
        <Route path="/cabinet" element={<Cabinet />}></Route>
      </Routes>
      </Router>
    </div>
  )
}

export default App
