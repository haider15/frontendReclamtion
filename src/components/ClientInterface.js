import React, { useState } from 'react';
import axios from 'axios';
import './ClientInterface.css';

const ClientInterface = () => {
  const [description, setDescription] = useState('');
  const [historique, setHistorique] = useState([]);
  const [showHistorique, setShowHistorique] = useState(false);
  const [clientId] = useState(1); // Remplacer avec l'ID réel du client (stocké via login/localStorage...)

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/reclamations`, {
        description,
        client: { id: clientId },
      });
      alert('Réclamation envoyée avec succès');
      setDescription('');
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la réclamation', err);
      alert('Erreur lors de l\'envoi de la réclamation');
    }
  };

  const fetchHistorique = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reclamations/`);
      setHistorique(response.data);
      setShowHistorique(true);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique', err);
    }
  };

  return (
    <div className="client-interface">
      <h2>Ajouter une Réclamation</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez votre problème..."
          rows={4}
          required
        />
        <button type="submit">Envoyer</button>
      </form>

      <hr />

      <button onClick={fetchHistorique}>Voir Historique</button>

      {showHistorique && (
        <div className="historique">
          <h3>Historique des Réclamations</h3>
          <ul>
            {historique.map(rec => (
              <li key={rec.id}>
                <strong>ID:</strong> {rec.id} — <strong>Description:</strong> {rec.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClientInterface;
