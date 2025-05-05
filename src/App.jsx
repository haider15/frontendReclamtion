import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AgentSAVTable from './components/AgentSAVTable';
import ClientTable from './components/ClientTable';
import ReclamationTable from './components/ReclamationTable';
import SuiviReclamationTable from './components/SuiviReclamation';

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/agent" element={<AgentSAVTable />} />
          <Route path="/client" element={<ClientTable />} />
          <Route path="/reclmation" element={<ReclamationTable />} />
          <Route path="/suivi" element={<SuiviReclamationTable />} />
          <Route path="*" element={<Navigate to="/agent" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
