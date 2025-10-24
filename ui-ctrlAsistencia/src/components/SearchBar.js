import React from "react";
import "./SearchBar.css";

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar asignatura..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="search-input"
        />
        <label className="search-label">Asignatura</label>
      </div>
    </div>
  );
}

export default SearchBar;
