// src/components/Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Tableau de Bord</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/reclamations" activeClassName="active">
              <i className="icon">📋</i>
              <span>Réclamations</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/affectation" activeClassName="active">
              <i className="icon">👥</i>
              <span>Affectation</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/agents" activeClassName="active">
              <i className="icon">🛠️</i>
              <span>Agents</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/clients" activeClassName="active">
              <i className="icon">👔</i>
              <span>Clients</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/suivi-reclamations" activeClassName="active">
              <i className="icon">📊</i>
              <span>Suivi</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p>Version 1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;