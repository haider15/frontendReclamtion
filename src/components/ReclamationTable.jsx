import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const ReclamationTable = () => {
  const [reclamations, setReclamations] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    date: '',
    statut: '',
    clientId: '',
    note: 0,
    produit: '',
    satisfaction: null
  });
  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reclamationToDelete, setReclamationToDelete] = useState(null);

  // Charger les données
  const fetchReclamations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reclamations`);
      setReclamations(response.data);
    } catch (err) {
      console.error('Erreur de chargement des réclamations :', err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/clients`);
      setClients(res.data);
    } catch (err) {
      console.error('Erreur de chargement des clients :', err);
    }
  };

  useEffect(() => {
    fetchReclamations();
    fetchClients();
  }, []);

  // Ouvrir modal ajout
  const openModalToAdd = () => {
    setFormData({
      description: '',
      date: '',
      statut: '',
      clientId: '',
      note: 0,
      produit: '',
      satisfaction: null
    });
    setEditingId(null);
    setShowModal(true);
  };

  // Ouvrir modal modification
  const openModalToEdit = (reclamation) => {
    const rawDate = reclamation.date;
    const dateISO = rawDate ? rawDate.split('T')[0] : '';
    setFormData({
      description: reclamation.description || '',
      date: dateISO,
      statut: reclamation.statut || '',
      clientId: reclamation.client?.id || '',
      note: reclamation.note || 0,
      produit: reclamation.produit || '',
      satisfaction: reclamation.satisfaction ?? null
    });
    setEditingId(reclamation.id);
    setShowModal(true);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clientId) {
      alert('Veuillez sélectionner un client.');
      return;
    }

    // Construire l'objet conforme au backend (client comme objet)
    const dataToSend = {
      description: formData.description,
      date: formData.date,
      statut: formData.statut,
      client: { id: formData.clientId },
      note: formData.note,
      produit: formData.produit,
      satisfaction: formData.satisfaction
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/reclamations/${editingId}`, dataToSend);
      } else {
        await axios.post(`${API_URL}/api/reclamations`, dataToSend);
      }
      setShowModal(false);
      fetchReclamations();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde :', err);
    }
  };

  // Suppression
  const handleDelete = async () => {
    if (reclamationToDelete) {
      try {
        await axios.delete(`${API_URL}/api/reclamations/${reclamationToDelete.id}`);
        fetchReclamations();
        setShowDeleteModal(false);
        setReclamationToDelete(null);
      } catch (err) {
        console.error('Erreur lors de la suppression :', err);
      }
    }
  };

  // Changement formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'clientId' || name === 'note' ? Number(value) : value,
    });
  };

  // Rendu simplifié du tableau et formulaire, sans agent
  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2>Gestion des Réclamations</h2>
      <button onClick={openModalToAdd}>➕ Ajouter une réclamation</button>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Client</th>
            <th>Note</th>
            <th>Produit</th>
            <th>Satisfaction</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reclamations.map(r => {
            const client = clients.find(c => c.id === r.client?.id);
            const dateISO = r.date ? r.date.split('T')[0] : '';
            return (
              <tr key={r.id}>
                <td>{r.description}</td>
                <td>{dateISO}</td>
                <td>{r.statut}</td>
                <td>{client ? client.nom : 'N/A'}</td>
                <td>
  {[...Array(5)].map((_, i) => (
    <span key={i} style={{ color: i < r.note ? '#ffc107' : '#e4e5e9' }}>
      ★
    </span>
  ))}
</td>

                <td>{r.produit}</td>
                 <td>
  {[...Array(5)].map((_, i) => (
    <span key={i} style={{ color: i < r.satisfaction ? '#ffc107' : '#e4e5e9' }}>
      ★
    </span>
  ))}
</td>
                
                <td>
                  <button onClick={() => openModalToEdit(r)}>✏️</button>
                  <button onClick={() => { setReclamationToDelete(r); setShowDeleteModal(true); }}>🗑️</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <form
            style={{ background: 'white', padding: 20, borderRadius: 8, width: '90%', maxWidth: 500 }}
            onSubmit={handleSubmit}
          >
            <h3>{editingId ? 'Modifier' : 'Ajouter'} une réclamation</h3>
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ width: '100%', marginBottom: 10 }}
            />
           <input
  type="date"
  name="date"
  value={formData.date}
  onChange={handleChange}
  required
  min={new Date().toISOString().split("T")[0]} // limite la sélection à aujourd’hui ou plus tard
  style={{ width: '100%', marginBottom: 10 }}
/>

            <input
              type="text"
              name="statut"
              placeholder="Statut"
              value={formData.statut}
              onChange={handleChange}
              required
              style={{ width: '100%', marginBottom: 10 }}
            />
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              style={{ width: '100%', marginBottom: 10 }}
            >
              <option value="">Sélectionner un client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.nom}</option>
              ))}
            </select>
          <div style={{ marginBottom: 10 }}>
  {[1, 2, 3, 4, 5].map((value) => (
    <span
      key={value}
      onClick={() => handleChange({ target: { name: 'note', value } })}
      style={{
        cursor: 'pointer',
        color: value <= formData.note ? '#ffc107' : '#e4e5e9',
        fontSize: '24px',
        marginRight: 5,
      }}
    >
      ★
    </span>
  ))}
</div>

            <input
              type="text"
              name="produit"
              placeholder="Produit"
              value={formData.produit}
              onChange={handleChange}
              style={{ width: '100%', marginBottom: 10 }}
            />
           <div style={{ marginBottom: 10 }}>
  {[1, 2, 3, 4, 5].map((value) => (
    <span
      key={value}
      onClick={() => handleChange({ target: { name: 'satisfaction', value } })}
      style={{
        cursor: 'pointer',
        color: value <= (formData.satisfaction ?? 0) ? '#ffc107' : '#e4e5e9',
        fontSize: '24px',
        marginRight: 5,
      }}
    >
      ★
    </span>
  ))}
</div>
<div style={{ fontSize: '14px', marginTop: 4 }}>
  Satisfaction : {formData.satisfaction ?? 0}/5
</div>

            <button type="submit">{editingId ? 'Modifier' : 'Ajouter'}</button>
            <button type="button" onClick={() => setShowModal(false)} style={{ marginLeft: 10 }}>Annuler</button>
          </form>
        </div>
      )}

      {showDeleteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 8 }}>
            <p>Confirmer la suppression de la réclamation ?</p>
            <button onClick={handleDelete}>Oui</button>
            <button onClick={() => setShowDeleteModal(false)} style={{ marginLeft: 10 }}>Non</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReclamationTable;
