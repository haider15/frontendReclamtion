import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const AgentSAVTable = () => {
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({ nom: '', competence: '' , motDePasse: ''});
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/agents`);
      setAgents(response.data);
    } catch (err) {
      console.error('Erreur de chargement des agents :', err);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const openModalToAdd = () => {
    setFormData({ nom: '',  competence: '', motDePasse: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openModalToEdit = (agent) => {
    setFormData(agent);
    setEditingId(agent.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/agents/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/api/agents`, formData);
      }
      setShowModal(false);
      fetchAgents();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde :', err);
    }
  };

  const handleDelete = async () => {
    if (agentToDelete) {
      try {
        await axios.delete(`${API_URL}/api/agents/${agentToDelete}`);
        setShowDeleteConfirm(false);
        fetchAgents();
      } catch (err) {
        console.error('Erreur lors de la suppression :', err);
      }
    }
  };

  const confirmDelete = (id) => {
    setAgentToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    deleteConfirmModal: {
      background: '#fff',
      padding: '2rem',
      borderRadius: '10px',
      width: '100%',
      maxWidth: '500px'
    },
    deleteConfirmBtn: {
      padding: '10px 15px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Gestion des Agents SAV</h2>
      <button style={styles.button} onClick={openModalToAdd}>➕ Ajouter un agent</button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nom</th>
            <th style={styles.th}>Compétence</th>
            <th style={styles.th}>mot de passe</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map(agent => (
            <tr key={agent.id}>
              <td style={styles.td}>{agent.nom}</td>
              <td style={styles.td}>{agent.competence}</td>
              <td style={styles.td}>{agent.motDePasse}</td>
              <td style={styles.td}>
                <button style={styles.iconBtn} onClick={() => openModalToEdit(agent)}>✏️</button>
                <button
                  style={{ ...styles.iconBtn, color: 'red' }}
                  onClick={() => confirmDelete(agent.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>{editingId ? 'Modifier Agent' : 'Ajouter Agent'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                style={styles.modalInput}
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Nom"
                required
              />
              
              <input
                style={styles.modalInput}
                name="competence"
                value={formData.competence}
                onChange={handleChange}
                placeholder="competence"
                required
              />

             <input
                style={styles.modalInput}
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                placeholder="motDePasse"
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

      {showDeleteConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.deleteConfirmModal}>
            <h3>Êtes-vous sûr de vouloir supprimer cet agent ?</h3>
            <div style={styles.modalActions}>
              <button
                style={styles.deleteConfirmBtn}
                onClick={handleDelete}
              >
                Confirmer
              </button>
              <button
                style={{ ...styles.button, backgroundColor: '#6c757d' }}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSAVTable;
