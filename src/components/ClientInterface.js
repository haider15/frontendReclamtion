import React, { useState } from 'react';
import axios from 'axios';
import './ClientInterface.css';

const ClientInterface = () => {
  const [description, setDescription] = useState('');
  const [historique, setHistorique] = useState([]);
  const [showHistorique, setShowHistorique] = useState(false);
  const [clientId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistorique = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/reclamations/`);
      setHistorique(response.data);
      setShowHistorique(!showHistorique);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="client-interface">
      <header>
        <h2>Interface Client</h2>
      </header>
      
      <section className="reclamation-form">
        <h3>Nouvelle Réclamation</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre problème en détail..."
            rows={5}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Envoi en cours...' : 'Envoyer la réclamation'}
          </button>
        </form>
      </section>

      <section className="historique-section">
        <button 
          onClick={fetchHistorique} 
          className="toggle-historique"
          disabled={isLoading}
        >
          {showHistorique ? 'Masquer l\'historique' : 'Afficher l\'historique'}
        </button>

        {showHistorique && (
          <div className="historique">
            <h3>Historique des Réclamations</h3>
            {historique.length === 0 ? (
              <p className="no-data">Aucune réclamation trouvée</p>
            ) : (
              <ul>
                {historique.map(rec => (
                  <li key={rec.id}>
                    <div className="reclamation-header">
                      <span className="reclamation-id">Réclamation #{rec.id}</span>
                      <span className="reclamation-date">{new Date(rec.date || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="reclamation-content">{rec.description}</div>
                    {rec.status && <div className={`reclamation-status ${rec.status.toLowerCase()}`}>
                      Statut: {rec.status}
                    </div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ClientInterface;