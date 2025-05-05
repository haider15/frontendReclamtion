import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const ReclamationTable = () => {
  const [reclamations, setReclamations] = useState([]);
  const [formData, setFormData] = useState({ description: '', date: '', statut: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal de confirmation de suppression
  const [reclamationToDelete, setReclamationToDelete] = useState(null); // Réclamation à supprimer

  const fetchReclamations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reclamations`);
      setReclamations(response.data);
    } catch (err) {
      console.error('Erreur de chargement des réclamations :', err);
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  const openModalToAdd = () => {
    setFormData({ description: '', date: '', statut: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openModalToEdit = (reclamation) => {
    setFormData(reclamation);
    setEditingId(reclamation.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/reclamations/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/api/reclamations`, formData);
      }
      setShowModal(false);
      fetchReclamations();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde :', err);
    }
  };

  const handleDelete = async () => {
    if (reclamationToDelete) {
      await axios.delete(`${API_URL}/api/reclamations/${reclamationToDelete.id}`);
      fetchReclamations();
      setShowDeleteModal(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAffecterAgent = async (reclamationId, agentId) => {
    try {
      await axios.put(`${API_URL}/api/reclamations/${reclamationId}/affecter-agent/${agentId}`);
      fetchReclamations();
    } catch (err) {
      console.error('Erreur lors de l\'affectation de l\'agent :', err);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reclamations/rapport-satisfaction`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rapport_satisfaction.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Erreur lors du téléchargement du rapport :', err);
    }
  };

  const styles = {
    container: { maxWidth: '900px', margin: 'auto', padding: '2rem', fontFamily: 'Arial, sans-serif' },
    button: {
      padding: '10px 15px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginBottom: '1rem'
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { backgroundColor: '#007bff', color: '#fff', padding: '10px' },
    td: { padding: '10px', border: '1px solid #ddd', textAlign: 'center' },
    iconBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.2rem',
      margin: '0 5px',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: '#fff',
      padding: '2rem',
      borderRadius: '10px',
      width: '100%',
      maxWidth: '500px'
    },
    modalInput: {
      width: '100%',
      padding: '10px',
      marginBottom: '1rem',
      borderRadius: '5px',
      border: '1px solid #ccc'
    },
    modalActions: { display: 'flex', justifyContent: 'space-between' },
    modalButton: {
      padding: '10px 15px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      <h2>Gestion des Réclamations</h2>
      <button style={styles.button} onClick={openModalToAdd}>➕ Ajouter une réclamation</button>
      <button style={styles.button} onClick={handleDownloadReport}>📄 Télécharger le rapport de satisfaction</button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Statut</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reclamations.map(reclamation => (
            <tr key={reclamation.id}>
              <td style={styles.td}>{reclamation.description}</td>
              <td style={styles.td}>{reclamation.date}</td>
              <td style={styles.td}>{reclamation.statut}</td>
              <td style={styles.td}>
                <button style={styles.iconBtn} onClick={() => openModalToEdit(reclamation)}>✏️</button>
                <button
                  style={{ ...styles.iconBtn, color: 'red' }}
                  onClick={() => { setReclamationToDelete(reclamation); setShowDeleteModal(true); }}
                >
                  🗑️
                </button>
                <button style={styles.iconBtn} onClick={() => handleAffecterAgent(reclamation.id, 1)}>Affecter Agent</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Êtes-vous sûr de vouloir supprimer cette réclamation ?</h3>
            <div style={styles.modalActions}>
              <button
                style={styles.modalButton}
                onClick={handleDelete}
              >
                Confirmer
              </button>
              <button
                style={styles.modalButton}
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout/édition */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>{editingId ? 'Modifier Réclamation' : 'Ajouter Réclamation'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                style={styles.modalInput}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
              />
              <input
                style={styles.modalInput}
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="Date"
                required
              />
              <input
                style={styles.modalInput}
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                placeholder="Statut"
                required
              />
              <div style={styles.modalActions}>
                <button type="submit" style={{ ...styles.button, backgroundColor: '#007bff' }}>
                  {editingId ? 'Enregistrer' : 'Ajouter'}
                </button>
                <button type="button" style={{ ...styles.button, backgroundColor: '#6c757d' }} onClick={() => setShowModal(false)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReclamationTable;
