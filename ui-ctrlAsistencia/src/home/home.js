import React, { useEffect, useState } from "react";
import UserMenu from "../components/UserMenu";
import AsignaturaCard from "../components/AsignaturaCard";
import EstudianteCard from "../components/EstudianteCard";
import DocenteCard from "../components/DocenteCard";
import SearchBar from "../components/SearchBar";
import "./home.css";

// Componente principal que muestra el dashboard con información según el rol del usuario
function Home() {
  // Estados para gestionar usuario, datos mostrados, búsqueda y sección activa
  const [usuario, setUsuario] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [seccion, setSeccion] = useState("asignaturas");

  // Carga los datos del usuario autenticado al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    fetch("http://localhost:8080/api/usuario/home", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener usuario");
        return res.json();
      })
      .then((data) => {
        setUsuario(data);
        setData(data.asignaturas || []);
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  // Función para cerrar sesión y limpiar el token
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Cambia la sección activa y carga los datos correspondientes desde el backend
  const handleSelectSection = (section) => {
    setSeccion(section);
    const token = localStorage.getItem("token");
    let url = "";

    // Determina la URL según la sección seleccionada
    if (section === "docentes") url = "http://localhost:8080/api/docente/lista";
    if (section === "estudiantes") url = "http://localhost:8080/api/estudiante/lista";
    if (section === "asignaturas") url = "http://localhost:8080/api/asignatura/lista";
    if (section === "cursos") url = "http://localhost:8080/api/curso/lista";

    // Si es la sección de clases y el usuario es docente, obtiene sus clases específicas
    if (section === "clases" && usuario?.rol === "DOCENTE") {
      url = `http://localhost:8080/api/clase/docente/${usuario.idDocente}`;
    }

    if (url) {
      fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error(err));
    } else {
      setData([]);
    }
  };

  // Función que verifica si un elemento coincide con el término de búsqueda
  const matchesSearch = (item) => {
    const q = search.toLowerCase();

    // Define qué campos buscar según la sección activa
    const fields = {
      asignaturas: ["nombre", "codigo"],
      docentes: ["nombre", "apellido", "rut"],
      estudiantes: ["nombre", "apellido", "rut"],
    }[seccion];

    if (!fields) return true;

    return fields.some((f) => (item[f] || "").toLowerCase().includes(q));
  };

  const filtered = data.filter(matchesSearch);

  // Renderiza la tarjeta correspondiente según el tipo de dato
  const renderCard = (item) => {
    switch (seccion) {
      case "asignaturas":
        return <AsignaturaCard key={item.idAsignatura} asignatura={item} />;
      case "docentes":
        return <DocenteCard key={item.idDocente} docente={item} />;
      case "estudiantes":
        return <EstudianteCard key={item.idEstudiante} estudiante={item} />;
      default:
        return null;
    }
  };

  // Muestra mensaje de carga mientras se obtienen los datos del usuario
  if (!usuario) return <p>Cargando...</p>;

  return (
    <div className="home-container">
      <div className="home-left">
        <h1>Bienvenido, {usuario.nombreCompleto}</h1>
        <p>Rol: {usuario.rol}</p>

        {/* Barra de búsqueda visible solo en secciones con funcionalidad de filtrado */}
        {["asignaturas", "docentes", "estudiantes"].includes(seccion) && (
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={`Buscar ${seccion}...`}
          />
        )}

        {/* Área principal que muestra las tarjetas filtradas o mensajes informativos */}
        <div className="asignaturas-grid">
          {["cursos", "matriculas"].includes(seccion) ? (
            <p>Usa el menú de la derecha para gestionar {seccion}.</p>
          ) : filtered.length > 0 ? (
            filtered.map((item) => renderCard(item))
          ) : (
            <p>No se encontraron {seccion}.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;