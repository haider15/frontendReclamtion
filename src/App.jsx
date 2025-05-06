import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Assurez-vous que Sidebar est bien importé
import AgentSAVTable from './components/AgentSAVTable';
import ClientTable from './components/ClientTable';
import ReclamationTable from './components/ReclamationTable';
import SuiviReclamationTable from './components/SuiviReclamation';
import Affectation from './components/Affectation';
import './App.css'; // Importer votre CSS si nécessaire
import ClientInterface from './components/ClientInterface';
import Login from './components/Login';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/agents" element={<AgentSAVTable />} />
            <Route path="/clients" element={<ClientTable />} />
            <Route path="/reclamations" element={<ReclamationTable />} />
            <Route path="/suivi-reclamations" element={<SuiviReclamationTable />} />
            <Route path="/affectation" element={<Affectation />} />
           < Route path="/client" element={<ClientInterface />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
