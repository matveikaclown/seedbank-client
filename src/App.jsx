import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import './App.css';

import api from "./conf/api";
import ProtectedRoute from './conf/protectedroutes';

import Header from './components/header.component';
import Login from './pages/login.page';
import Cabinet from './pages/cabinet.page';
import EditUser from './pages/useredit.page';

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
    Cookies.set('UserData', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      setUser(null);
      const response = await api.post('/auth/logout');
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
          <Route path="/cabinet" element={
            <ProtectedRoute allowedRoles={["su", "u"]}>
              <Cabinet />
            </ProtectedRoute>
          }/>
          <Route path="/cabinet/edit-user/:login" element={
            <ProtectedRoute allowedRoles={["su"]}>
              <EditUser onLogin={handleLogin} />
            </ProtectedRoute>
          }/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
