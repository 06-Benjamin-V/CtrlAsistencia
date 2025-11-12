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
import SubirCsvDocente from "./forms/subirCsvDocente";
import EditarAsignatura from './forms/EditarAsignatura';
import EditarDocente from './forms/EditarDocente';
import EditarEstudiante from './forms/EditarEstudiante';
import EditarCurso from './forms/EditarCurso';
import EliminarAsignatura from './forms/EliminarAsignatura';
import EliminarDocente from "./forms/EliminarDocente";
import EliminarEstudiante from "./forms/EliminarEstudiante";
import EliminarCurso from "./forms/EliminarCurso";
import EliminarMatricula from "./forms/EliminarMatricula";
import MarcarAsistencia from "./forms/MarcarAsistencia";

// Página de detalle de asignatura
import AsignaturaPage from "./asignatura/AsignaturaPage";

// Docente
import VerClasesDocente from "./forms/VerClasesDocente";

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8080/api/usuario/home", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setUsuario(data))
        .catch(() => setUsuario(null));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    window.location.href = "/login";
  };

  const handleSelectSection = () => {};

  return (
    <>
      <Header 
        usuario={usuario} 
        onLogout={handleLogout}
        onSelectSection={handleSelectSection}
      />

      <main className="App-main">
        <Routes>
          {/* Redirección inicial */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login público */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login onLoginSuccess={setUsuario} />
              </PublicRoute>
            } 
          />

          {/* Página principal */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />

          {/* Detalle de asignatura */}
          <Route 
            path="/asignatura/:id" 
            element={
              <ProtectedRoute>
                <AsignaturaPage />
              </ProtectedRoute>
            } 
          />

          {/* CSV */}
          <Route path="/admin/estudiantes/csv" element={<ProtectedRoute role="ADMINISTRATIVO"><SubirCsvEstudiantes /></ProtectedRoute>} />
          <Route path="/admin/docentes/csv" element={<ProtectedRoute role="ADMINISTRATIVO"><SubirCsvDocente /></ProtectedRoute>} />

          {/* Asignaturas */}
          <Route path="/admin/asignaturas/crear" element={<ProtectedRoute role="ADMINISTRATIVO"><CrearAsignatura /></ProtectedRoute>} />
          <Route path="/admin/asignaturas/editar" element={<ProtectedRoute role="ADMINISTRATIVO"><EditarAsignatura /></ProtectedRoute>} />
          <Route path="/admin/asignaturas/eliminar" element={<ProtectedRoute role="ADMINISTRATIVO"><EliminarAsignatura /></ProtectedRoute>} />

          {/* Docentes */}
          <Route path="/admin/docentes/crear" element={<ProtectedRoute role="ADMINISTRATIVO"><CrearDocente /></ProtectedRoute>} />
          <Route path="/admin/docentes/editar" element={<ProtectedRoute role="ADMINISTRATIVO"><EditarDocente /></ProtectedRoute>} />
          <Route path="/admin/docentes/eliminar" element={<ProtectedRoute role="ADMINISTRATIVO"><EliminarDocente /></ProtectedRoute>} />

          {/* Estudiantes */}
          <Route path="/admin/estudiantes/crear" element={<ProtectedRoute role="ADMINISTRATIVO"><CrearEstudiante /></ProtectedRoute>} />
          <Route path="/admin/estudiantes/editar" element={<ProtectedRoute role="ADMINISTRATIVO"><EditarEstudiante /></ProtectedRoute>} />
          <Route path="/admin/estudiantes/eliminar" element={<ProtectedRoute role="ADMINISTRATIVO"><EliminarEstudiante /></ProtectedRoute>} />

          {/* Cursos */}
          <Route path="/admin/cursos/crear" element={<ProtectedRoute role="ADMINISTRATIVO"><CrearCurso /></ProtectedRoute>} />
          <Route path="/admin/cursos/editar" element={<ProtectedRoute role="ADMINISTRATIVO"><EditarCurso /></ProtectedRoute>} />
          <Route path="/admin/cursos/eliminar" element={<ProtectedRoute role="ADMINISTRATIVO"><EliminarCurso /></ProtectedRoute>} />

          {/* Matrículas */}
          <Route path="/admin/matriculas/crear" element={<ProtectedRoute role="ADMINISTRATIVO"><CrearMatricula /></ProtectedRoute>} />
          <Route path="/admin/matriculas/eliminar" element={<ProtectedRoute role="ADMINISTRATIVO"><EliminarMatricula /></ProtectedRoute>} />

          {/* 🧑‍🏫 Docente crea clases */}
          <Route path="/docente/clases/crear" element={<ProtectedRoute role="DOCENTE"><CrearClase /></ProtectedRoute>} />

          {/* 👀 Docente ve sus clases y asistencias */}
          <Route path="/docente/clases/ver" element={<ProtectedRoute role="DOCENTE"><VerClasesDocente /></ProtectedRoute>} />

          {/* 🎓 Estudiante marca asistencia */}
          <Route path="/estudiante/asistencia" element={<ProtectedRoute role="ESTUDIANTE"><MarcarAsistencia /></ProtectedRoute>} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
