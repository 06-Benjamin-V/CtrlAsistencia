import "./UserMenu.css";
import { useNavigate } from "react-router-dom";

function UserMenu({ rol, onLogout }) {
  const navigate = useNavigate();

  const opciones = {
    ADMINISTRATIVO: [
      { key: "asignaturas", label: "Asignaturas", href: "/admin/asignaturas" },
      { key: "docentes", label: "Docentes", href: "/admin/docentes" },
      { key: "estudiantes", label: "Estudiantes", href: "/admin/estudiantes" },
      { key: "cursos", label: "Cursos", href: "/admin/cursos" },
      { key: "matriculas", label: "Matrículas", href: "/admin/matriculas" },
    ],
    DOCENTE: [
      { key: "asignaturas", label: "Mis Asignaturas", href: "/docente/asignaturas" },
      { key: "clases", label: "Clases", href: "/docente/clases" },
    ],
    ESTUDIANTE: [
      { key: "asignaturas", label: "Mis Asignaturas", href: "/estudiante/asignaturas" },
      { key: "asistencia", label: "Registrar Asistencia", href: "/estudiante/asistencia" },
    ],
  };

  return (
    <div className="user-menu-horizontal">
      <ul className="menu-principal">
        {opciones[rol]?.map((item) => (
          <li key={item.key}>
            <button onClick={() => navigate(item.href)}>
              {item.label}
            </button>
          </li>
        ))}
        <li>
          <button className="logout-btn" onClick={onLogout}>
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  );
}

export default UserMenu;
