import React, { useEffect, useState } from "react";
import UserMenu from "../components/UserMenu";
import AsignaturaCard from "../components/AsignaturaCard";
import SearchBar from "../components/SearchBar";
import "./home.css";

function Home() {
  const [usuario, setUsuario] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);
  const [search, setSearch] = useState("");

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
        setAsignaturas(data.asignaturas || []);
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

  if (!usuario) return <p>Cargando...</p>;

  const filteredAsignaturas = asignaturas.filter((a) =>
    a.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="home-left">
        <h1>Bienvenido, {usuario.nombreCompleto}</h1>
        <p>Rol: {usuario.rol}</p>

        {/* Barra de búsqueda */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Grid de asignaturas */}
        <div className="asignaturas-grid">
          {filteredAsignaturas.length > 0 ? (
            filteredAsignaturas.map((asig) => (
              <AsignaturaCard key={asig.id} asignatura={asig} />
            ))
          ) : (
            <p>No se encontraron asignaturas.</p>
          )}
        </div>
      </div>

      <div className="admin-menu-box">
        <UserMenu rol={usuario.rol} onLogout={handleLogout} />
      </div>
    </div>
  );
}

export default Home;
