import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const token = localStorage.getItem('token'); // Перевірка токену

  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
