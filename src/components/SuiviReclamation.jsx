import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const SuiviReclamationTable = () => {
  const [suivis, setSuivis] = useState([]);
  const [formData, setFormData] = useState({
    agentId: '',
    message: '',
    action: '',
    note: '',
    description: '',
    produit: '',
    clientId: '',
    employeId: '',
  });
  const [clients, setClients] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [reclamationId, setReclamationId] = useState('');

  const fetchSuivis = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/suivis`);
      setSuivis(response.data);
    } catch (err) {
      console.error('Erreur de chargement des suivis :', err);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/clients`);
      setClients(response.data);
    } catch (err) {
      console.error('Erreur chargement clients :', err);
    }
  };

  const fetchEmployes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/employes`);
      setEmployes(response.data);
    } catch (err) {
      console.error('Erreur chargement employés :', err);
    }
  };

  useEffect(() => {
    fetchSuivis();
    fetchClients();
    fetchEmployes();
  }, []);

  const openModalToAdd = () => {
    setFormData({
      agentId: '',
      message: '',
      action: '',
      note: '',
      description: '',
      produit: '',
      clientId: '',
      employeId: '',
    });
    setEditingId(null);
    setShowModal(true);
  };

  const openModalToEdit = (suivi) => {
    setFormData({
      agentId: suivi.agentId,
      message: suivi.message,
      action: suivi.action,
      note: suivi.reclamation.note,
      description: suivi.reclamation.description,
      produit: suivi.reclamation.produit,
      clientId: suivi.reclamation.client.id,
      employeId: suivi.employe.id,
    });
    setEditingId(suivi.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/suivis/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/api/suivis/${reclamationId}/suivi`, formData);
      }
      setShowModal(false);
      fetchSuivis();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du suivi :', err);
    }
  };

  const handleDelete = async () => {
    if (deletingId) {
      await axios.delete(`${API_URL}/api/suivis/${deletingId}`);
      setShowDeleteModal(false);
      fetchSuivis();
    }
  };

  const openDeleteModal = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingId(null);
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
    modalActions: { display: 'flex', justifyContent: 'space-between' }
  };

  return (
    <div style={styles.container}>
      <h2>Gestion des Suivis de Réclamations</h2>

      <button style={styles.button} onClick={openModalToAdd}>
        ➕ Ajouter un suivi
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nom du Client</th>
            <th style={styles.th}>Nom de l'Employé</th>
            <th style={styles.th}>Note</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Produit</th>
            <th style={styles.th}>Message</th>
            <th style={styles.th}>Action</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suivis.map(suivi => (
            <tr key={suivi.id}>
              <td style={styles.td}>{suivi.reclamation.client.nom}</td>
              <td style={styles.td}>{suivi.employe.nom}</td>
              <td style={styles.td}>{suivi.reclamation.note}</td>
              <td style={styles.td}>{suivi.reclamation.description}</td>
              <td style={styles.td}>{suivi.reclamation.produit}</td>
              <td style={styles.td}>{suivi.message}</td>
              <td style={styles.td}>{suivi.action}</td>
              <td style={styles.td}>
                <button style={styles.iconBtn} onClick={() => openModalToEdit(suivi)}>✏️</button>
                <button style={{ ...styles.iconBtn, color: 'red' }} onClick={() => openDeleteModal(suivi.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>{editingId ? 'Modifier Suivi' : 'Ajouter Suivi'}</h3>
            <form onSubmit={handleSubmit}>
              <select
                style={styles.modalInput}
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.nom}</option>
                ))}
              </select>

              <select
                style={styles.modalInput}
                name="employeId"
                value={formData.employeId}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner un employé</option>
                {employes.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.nom}</option>
                ))}
              </select>

              <input
                style={styles.modalInput}
                name="agentId"
                value={formData.agentId}
                onChange={handleChange}
                placeholder="Agent ID"
                required
              />
              <input
                style={styles.modalInput}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                required
              />
              <input
                style={styles.modalInput}
                name="action"
                value={formData.action}
                onChange={handleChange}
                placeholder="Action"
                required
              />
              <input
                style={styles.modalInput}
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Note"
                required
              />
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
                name="produit"
                value={formData.produit}
                onChange={handleChange}
                placeholder="Produit"
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

      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Êtes-vous sûr de vouloir supprimer ce suivi ?</h3>
            <div style={styles.modalActions}>
              <button style={{ ...styles.button, backgroundColor: '#dc3545' }} onClick={handleDelete}>
                Supprimer
              </button>
              <button style={{ ...styles.button, backgroundColor: '#6c757d' }} onClick={cancelDelete}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuiviReclamationTable;
