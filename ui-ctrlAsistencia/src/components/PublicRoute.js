import React from 'react';
import { Navigate } from 'react-router-dom';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function PublicRoute({ children }) {
  const token = localStorage.getItem('token');

  if (token) {
    const payload = parseJwt(token);
    const now = Date.now() / 1000;
    if (payload && payload.exp >= now) {
      return <Navigate to="/home" replace />;
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('nombre');
    }
  }

  return children;
}

export default PublicRoute;
