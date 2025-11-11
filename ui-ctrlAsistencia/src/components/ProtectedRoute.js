import React from 'react';
import { Navigate } from 'react-router-dom';

// Decodifica un token JWT y retorna su payload
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

// Componente que protege rutas privadas verificando autenticación y permisos por rol
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  const payload = parseJwt(token);
  const now = Date.now() / 1000;

  // Redirige a login si el token expiró o es inválido
  if (!payload || payload.exp < now) {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    return <Navigate to="/login" replace />;
  }

  // Verifica que el rol del usuario coincida con el rol requerido para la ruta
  if (role && payload.rol !== role) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;