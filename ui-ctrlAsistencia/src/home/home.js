import React, { useEffect, useState } from "react";
import UserMenu from "../components/UserMenu";
import AsignaturaCard from "../components/AsignaturaCard";
import EstudianteCard from "../components/EstudianteCard";
import DocenteCard from "../components/DocenteCard";
import SearchBar from "../components/SearchBar";
import "./home.css";

function Home() {
  const [usuario, setUsuario] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [seccion, setSeccion] = useState("asignaturas");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleSelectSection = (section) => {
  setSeccion(section);
  const token = localStorage.getItem("token");
  let url = "";


  if (section === "docentes") url = "http://localhost:8080/api/docente/lista";
  if (section === "estudiantes") url = "http://localhost:8080/api/estudiante/lista";
  if (section === "asignaturas") url = "http://localhost:8080/api/asignatura/lista";
  if (section === "cursos") url = "http://localhost:8080/api/curso/lista";

  if (section === "clases" && usuario.rol === "DOCENTE") {
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


  if (!usuario) return <p>Cargando...</p>;

  const matchesSearch = (item) => {
    const q = search.toLowerCase();

    if (seccion === "asignaturas") {
      return (
        (item.nombre || "").toLowerCase().includes(q) ||
        (item.codigo || "").toLowerCase().includes(q)
      );
    }

    if (seccion === "docentes") {
      return (
        (item.nombre || "").toLowerCase().includes(q) ||
        (item.apellido || "").toLowerCase().includes(q) ||
        (item.rut || "").toLowerCase().includes(q)
      );
    }

    if (seccion === "estudiantes") {
      return (
        (item.nombre || "").toLowerCase().includes(q) ||
        (item.apellido || "").toLowerCase().includes(q) ||
        (item.rut || "").toLowerCase().includes(q)
      );
    }

    return true;
  };

  const filtered = data.filter(matchesSearch);

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

  return (
    <div className="home-container">
      <div className="home-left">
        <h1>Bienvenido, {usuario.nombreCompleto}</h1>
        <p>Rol: {usuario.rol}</p>

        {/* Barra de búsqueda solo si aplica */}
        {["asignaturas", "docentes", "estudiantes"].includes(seccion) && (
          <SearchBar value={search} onChange={setSearch} placeholder={`Buscar ${seccion}...`} />
        )}

        {/* Grid de resultados */}
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

      <div className="admin-menu-box">
        <UserMenu
          rol={usuario.rol}
          onLogout={handleLogout}
          onSelectSection={handleSelectSection}
        />
      </div>
    </div>
  );
}

export default Home;
