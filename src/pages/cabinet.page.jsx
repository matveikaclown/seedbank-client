import React, { useEffect } from 'react';

function Cabinet() {
  useEffect(() => {
    document.title = "Личный кабинет";
  }, []);

  return (
    <div className="container mt-5">
      <h2>Страница профиля</h2>
      <p>Здесь будет информация о пользователе.</p>
    </div>
  );
}

export default Cabinet;