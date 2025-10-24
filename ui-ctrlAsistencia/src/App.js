import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './logIn/login';
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

          {/* Crear asignatura → SOLO ADMIN */}
          <Route 
            path="/admin/asignaturas/crear" 
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                <CrearAsignatura />
              </ProtectedRoute>
            } 
          />

          {/* Crear docente → SOLO ADMIN */}
          <Route 
            path="/admin/docentes/crear" 
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                <CrearDocente />
              </ProtectedRoute>
            } 
          />

          {/* Crear estudiante → SOLO ADMIN */}
          <Route
            path="/admin/estudiantes/crear"
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                <CrearEstudiante />
              </ProtectedRoute>
            }
          />

          {/* Crear curso → SOLO ADMIN */}
          <Route 
            path="/admin/cursos/crear" 
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                 <CrearCurso />
              </ProtectedRoute>
            }
          />

          {/* Matricular estudiante → SOLO ADMIN */}
          <Route 
            path="/admin/matriculas/crear" 
            element={
              <ProtectedRoute role="ADMINISTRATIVO">
                 <CrearMatricula />
              </ProtectedRoute>
            }
          />

          {/* Crear clase → SOLO DOCENTE */}
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
