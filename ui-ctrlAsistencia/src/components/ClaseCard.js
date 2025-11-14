import "./Card.css";

function ClaseCard({ clase }) {
  return (
    <div className="card">
      <h3>{clase.tema || "Clase sin tema"}</h3>
      <p><b>Fecha:</b> {clase.fecha}</p>
      <p><b>Curso:</b> {clase.curso?.asignatura?.nombre || "N/A"}</p>
      <p><b>Código asistencia:</b> {clase.codigoAsistencia}</p>
    </div>
  );
}

export default ClaseCard;
