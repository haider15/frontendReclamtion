// src/components/Sidebar.js
import React from "react";
import "./Sidebar.css"; // Importer le CSS

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <a href="/reclamations">Réclamations</a>
        </li>
        <li>
          <a href="/affectation">Affectation</a>
        </li>
        <li>
          <a href="/agents">Agents</a>
        </li>
        <li>
          <a href="/clients">client</a>
        </li>
        <li>
          <a href="/suivi-reclamations">suivi</a>
        </li>
        {/* Ajoutez d'autres liens ici si nécessaire */}
      </ul>
    </div>
  );
};

export default Sidebar;
