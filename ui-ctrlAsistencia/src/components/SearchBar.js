import React from "react";
import "./SearchBar.css";

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder || "Buscar..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  );
}

export default SearchBar;
