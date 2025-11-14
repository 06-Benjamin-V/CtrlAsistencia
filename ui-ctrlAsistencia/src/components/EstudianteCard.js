import "./Card.css";

function EstudianteCard({ estudiante }) {
  return (
    <div className="card">
      <h3>{estudiante.nombre} {estudiante.apellido}</h3>
      <p><strong>RUT:</strong> {estudiante.rut}</p>
      <p><strong>Correo:</strong> {estudiante.correo}</p>
      <p><strong>Carrera:</strong> {estudiante.carrera?.nombre || "Sin asignar"}</p>
      <p><strong>Activo:</strong> {estudiante.activo ? "Sí" : "No"}</p>
    </div>
  );
}

export default EstudianteCard;
