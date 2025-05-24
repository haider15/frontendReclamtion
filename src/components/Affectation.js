import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Affectation.css";

const Affectation = () => {
  const [reclamations, setReclamations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [recRes, agentsRes] = await Promise.all([
          axios.get(`${API_URL}/api/reclamations`),
          axios.get(`${API_URL}/api/agents`),
        ]);
        setReclamations(recRes.data);
        setAgents(agentsRes.data);
      } catch (err) {
        console.error("Erreur lors du chargement des données", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  const handleAgentChange = (reclamationId, agentId) => {
    setSelectedAgent((prev) => ({
      ...prev,
      [reclamationId]: agentId,
    }));
  };

  const affecterAgent = async (reclamationId) => {
    const agentId = selectedAgent[reclamationId];
    if (!agentId || agentId === "") {
      setError("Veuillez sélectionner un agent");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // 1. Affectation de l'agent
      await axios.put(
        `${API_URL}/api/reclamations/${reclamationId}/affecter-agent/${agentId}`
      );

      // 2. Création du suivi
      await axios.post(
        `${API_URL}/api/suivis/${reclamationId}/suivi`,
        {},
        {
          params: {
            agentId: agentId,
            message: "Agent affecté à la réclamation",
            action: "Affectation",
          },
        }
      );

      setSuccessMessage("Affectation réussie !");
      
      // Recharger les réclamations après affectation
      const recRes = await axios.get(`${API_URL}/api/reclamations`);
      setReclamations(recRes.data);
      
      // Reset du sélecteur pour cette réclamation
      setSelectedAgent(prev => {
        const newState = {...prev};
        delete newState[reclamationId];
        return newState;
      });
      
    } catch (err) {
      console.error("Erreur lors de l'affectation ou du suivi", err);
      setError("Erreur lors de l'affectation. Veuillez réessayer.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="affectation-container">
      <header className="page-header">
        <h1>Affectation des Agents</h1>
        <p>Assigner les agents aux réclamations clients</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {loading && reclamations.length === 0 ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des données...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="reclamations-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Description</th>
                <th>Statut</th>
                <th>Agent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reclamations.length > 0 ? (
                reclamations.map((reclamation) => (
                  <tr key={reclamation.id}>
                    <td>
                      <div className="client-info">
                        <span className="client-name">
                          {reclamation.client ? reclamation.client.nom : "Non spécifié"}
                        </span>
                        {/* {reclamation.client?.email && (
                          <span className="client-email">{reclamation.client.email}</span>
                        )} */}
                      </div>
                    </td>
                    <td className="description-cell">
                      <div className="description-content">
                        {reclamation.description}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${reclamation.statut?.toLowerCase() || 'nouveau'}`}>
                        {reclamation.statut || "Nouveau"}
                      </span>
                    </td>
                    <td>
                      <div className="agent-selector">
                        <select
                          value={selectedAgent[reclamation.id] || ""}
                          onChange={(e) =>
                            handleAgentChange(reclamation.id, e.target.value)
                          }
                          disabled={loading}
                        >
                          <option value="">Sélectionner...</option>
                          {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.nom} ({agent.competence})
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>
                      <button
                        className="affect-button"
                        onClick={() => affecterAgent(reclamation.id)}
                        disabled={loading || !selectedAgent[reclamation.id]}
                      >
                        {loading && selectedAgent[reclamation.id] ? (
                          <span className="button-loader"></span>
                        ) : (
                          "Affecter"
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    Aucune réclamation disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Affectation;