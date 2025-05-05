import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const ClientTable = () => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({ nom: '', email: '', telephone: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/clients`);
      setClients(response.data);
    } catch (err) {
      console.error('Erreur de chargement des clients :', err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openModalToAdd = () => {
    setFormData({ nom: '', email: '', telephone: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openModalToEdit = (client) => {
    setFormData(client);
    setEditingId(client.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/clients/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/api/clients`, formData);
      }
      setShowModal(false);
      fetchClients();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde :', err);
    }
  };

  const handleDelete = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
      try {
        await axios.delete(`${API_URL}/api/clients/${clientToDelete.id}`);
        fetchClients();
        setShowDeleteModal(false);
      } catch (err) {
        console.error('Erreur lors de la suppression :', err);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
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
    buttonDanger: {
      padding: '10px 15px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    buttonCancel: {
      padding: '10px 15px',
      backgroundColor: '#6c757d',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      <h2>Gestion des Clients</h2>
      <button style={styles.button} onClick={openModalToAdd}>➕ Ajouter un client</button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nom</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>telephone</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td style={styles.td}>{client.nom}</td>
              <td style={styles.td}>{client.email}</td>
              <td style={styles.td}>{client.telephone}</td>
              <td style={styles.td}>
                <button style={styles.iconBtn} onClick={() => openModalToEdit(client)}>✏️</button>
                <button style={{ ...styles.iconBtn, color: 'red' }} onClick={() => handleDelete(client)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Êtes-vous sûr de vouloir supprimer ce client ?</h3>
            <div style={styles.modalActions}>
              <button style={styles.buttonDanger} onClick={confirmDelete}>Confirmer</button>
              <button style={styles.buttonCancel} onClick={cancelDelete}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestion des clients (ajout/modification) */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>{editingId ? 'Modifier Client' : 'Ajouter Client'}</h3>
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email"
                required
              />
              <input
                style={styles.modalInput}
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="telephone"
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

export default ClientTable;
