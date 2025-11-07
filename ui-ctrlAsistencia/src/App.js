import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './logIn/login';
import './App.css';
import Home from './home/home';
import Header from './components/header';
import Footer from './components/footer';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Formularios
import CrearAsignatura from './forms/CrearAsignatura';
import CrearEstudiante from './forms/CrearEstudiante';
import CrearDocente from './forms/CrearDocente';
import CrearCurso from './forms/CrearCurso';
import CrearMatricula from './forms/CrearMatricula';
import CrearClase from './forms/CrearClase';
import SubirCsvEstudiantes from './forms/subirCsvEstudiante';


function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8080/api/usuario/home", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : null)
        .then((data) => setUsuario(data))
        .catch(() => setUsuario(null));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    window.location.href = "/login";
  };

  const handleSelectSection = (section) => {
    // Lógica de selección de sección si es necesaria
  };

  return (
    <>
      <Header 
        usuario={usuario} 
        onLogout={handleLogout}
        onSelectSection={handleSelectSection}
      />
      <main className="App-main">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login onLoginSuccess={setUsuario} />
              </PublicRoute>
            } 
          />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/estudiantes/csv"
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                <SubirCsvEstudiantes />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/admin/asignaturas/crear" 
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                <CrearAsignatura />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/docentes/crear" 
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                <CrearDocente />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin/estudiantes/crear"
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                <CrearEstudiante />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/cursos/crear" 
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                 <CrearCurso />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/matriculas/crear" 
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                 <CrearMatricula />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/docente/clases/crear" 
            element={
              <ProtectedRoute role="DOCENTE">
                 <CrearClase />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;