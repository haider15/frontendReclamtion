import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AgentSAVTable from './components/AgentSAVTable';
import ClientTable from './components/ClientTable';
import ReclamationTable from './components/ReclamationTable';
import SuiviReclamationTable from './components/SuiviReclamation';
import Affectation from './components/Affectation';
import ClientInterface from './components/ClientInterface';
import Login from './components/Login';
import './App.css';

const AppLayout = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login' || location.pathname === '/';

  return (
    <div className="app">
      {!hideSidebar && <Sidebar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agents" element={<AgentSAVTable />} />
          <Route path="/clients" element={<ClientTable />} />
          <Route path="/reclamations" element={<ReclamationTable />} />
          <Route path="/suivi-reclamations" element={<SuiviReclamationTable />} />
          <Route path="/affectation" element={<Affectation />} />
          <Route path="/client" element={<ClientInterface />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;
