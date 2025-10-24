import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './logIn/login';
import Home from './home/home';
import Header from './components/header';
import Footer from './components/footer';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import CrearAsignatura from './forms/CrearAsignatura';
import CrearEstudiante from './forms/CrearEstudiante';
import CrearDocente from './forms/CrearDocente';
import CrearCurso from './forms/CrearCurso';

function App() {
  return (
    <>
      <Header />
      <main className="App-main">
        <Routes>
          {/* Redirigir a login por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login público */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />

          {/* Home protegido para cualquier usuario logueado */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />

          {/* Crear asignatura protegido SOLO para ADMINISTRATIVO */}
          <Route 
            path="/admin/asignaturas/crear" 
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                <CrearAsignatura />
              </ProtectedRoute>
            } 
          />
          {/* Crear docente */}
          <Route 
            path="/admin/docentes/crear" 
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                <CrearDocente />
              </ProtectedRoute>
            } 
          />
          {/* Crear estudiante */}
          <Route
            path="/admin/estudiantes/crear"
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                <CrearEstudiante />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/admin/clases/crear" 
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                 <CrearCurso />
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
