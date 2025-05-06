import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Affectation.css';

const Affectation = () => {
  const [reclamations, setReclamations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState({});

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Charger les réclamations
    axios.get(`${API_URL}/api/reclamations`)
      .then(response => setReclamations(response.data))
      .catch(error => console.error('Erreur lors du chargement des réclamations', error));

    // Charger les agents
    axios.get(`${API_URL}/api/agents`)
      .then(response => setAgents(response.data))
      .catch(error => console.error('Erreur lors du chargement des agents', error));
  }, [API_URL]);

  const handleAgentChange = (reclamationId, agentId) => {
    setSelectedAgent(prevState => ({
      ...prevState,
      [reclamationId]: agentId
    }));
  };

  const affecterAgent = (reclamationId) => {
    const agentId = selectedAgent[reclamationId];
    if (!agentId) {
      alert('Veuillez sélectionner un agent');
      return;
    }

    axios.post(`${API_URL}/api/reclamations/${reclamationId}/affectation`, { agentId })
      .then(() => alert('Affectation réussie'))
      .catch(error => {
        console.error('Erreur lors de l\'affectation', error);
        alert('Erreur lors de l\'affectation');
      });
  };

  return (
    <div>
      <h1>Affectation des Agents aux Réclamations</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Nom du Client</th> {/* Changement ici */}
            <th>Description</th>
            <th>Agent Affecté</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reclamations.map(reclamation => (
            <tr key={reclamation.id}>
              <td>{reclamation.client ? `${reclamation.client.nom}` : 'Client inconnu'}</td> {/* Affichage du nom du client */}
              <td>{reclamation.description}</td>
              <td>
                <select
                  value={selectedAgent[reclamation.id] || ''}
                  onChange={(e) => handleAgentChange(reclamation.id, e.target.value)}
                >
                  <option value="">Sélectionner un agent</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.nom} 
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => affecterAgent(reclamation.id)}>
                  Affecter
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Affectation;
