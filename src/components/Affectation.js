import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Affectation.css";

const Affectation = () => {
  const [reclamations, setReclamations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
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
      alert("Veuillez sélectionner un agent");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Affectation de l'agent
      await axios.put(
        `${API_URL}/api/reclamations/${reclamationId}/affecter-agent/${agentId}`
      );

      // Logs pour debug
      console.log("Reclamation ID:", reclamationId);
      console.log("Agent ID:", agentId);
      console.log(
        "URL suivi:",
        `${API_URL}/api/reclamations/${reclamationId}/suivi`
      );
      console.log("Params suivi:", {
        agentId: agentId,
        message: "Agent affecté à la réclamation",
        action: "Affectation",
      });

      // 2. Création du suivi avec corps vide objet au lieu de null
      await axios.post(
        `${API_URL}/api/suivis/${reclamationId}/suivi`,
        {}, // corps vide
        {
          params: {
            agentId: agentId,
            message: "Agent affecté à la réclamation",
            action: "Affectation",
          },
        }
      );

      alert("Affectation et suivi réussis");

      // Recharger les réclamations après affectation
      const recRes = await axios.get(`${API_URL}/api/reclamations`);
      setReclamations(recRes.data);
    } catch (err) {
      console.error("Erreur lors de l'affectation ou du suivi", err);
      setError("Erreur lors de l'affectation ou du suivi");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (loading && reclamations.length === 0) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Affectation des Agents aux Réclamations</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Nom du Client</th>
            <th>Description</th>
            <th>Agent Affecté</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reclamations.map((reclamation) => (
            <tr key={reclamation.id}>
              <td>
                {reclamation.client ? reclamation.client.nom : "Client inconnu"}
              </td>
              <td>{reclamation.description}</td>
              <td>
                <select
                  value={selectedAgent[reclamation.id] || ""}
                  onChange={(e) =>
                    handleAgentChange(reclamation.id, e.target.value)
                  }
                  disabled={loading}
                >
                  <option value="">Sélectionner un agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.nom}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  onClick={() => affecterAgent(reclamation.id)}
                  disabled={loading}
                >
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
