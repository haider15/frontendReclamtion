import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const ClientTable = () => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({ 
    nom: '', 
    email: '', 
    telephone: '', 
    motDePasse: '' 
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/clients`);
      setClients(response.data);
    } catch (err) {
      console.error('Erreur de chargement des clients :', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openModalToAdd = () => {
    setFormData({ nom: '', email: '', telephone: '', motDePasse: '' });
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/api/clients/${clientToDelete.id}`);
      fetchClients();
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="client-management-container">
      <div className="client-management-header">
        <h2>Gestion des Clients</h2>
        <button className="btn btn-primary" onClick={openModalToAdd}>
          <span role="img" aria-label="add">➕</span> Ajouter un client
        </button>
      </div>

      {isLoading && !showModal ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Chargement des données...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="empty-state">
          <p>Aucun client trouvé</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="client-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Mot de passe</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td>{client.nom}</td>
                  <td>{client.email}</td>
                  <td>{client.telephone}</td>
                  <td>
                    <div className="password-field">
                      {client.motDePasse.replace(/./g, '•')}
                    </div>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="btn-icon edit-btn" 
                      onClick={() => openModalToEdit(client)}
                      title="Modifier"
                    >
                      <span role="img" aria-label="edit">✏️</span>
                    </button>
                    <button 
                      className="btn-icon delete-btn" 
                      onClick={() => handleDelete(client)}
                      title="Supprimer"
                    >
                      <span role="img" aria-label="delete">🗑️</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer le client <strong>{clientToDelete?.nom}</strong> ?</p>
            <div className="modal-actions">
              <button 
                className="btn btn-danger" 
                onClick={confirmDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Suppression...' : 'Confirmer'}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={cancelDelete}
                disabled={isLoading}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Client Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? 'Modifier Client' : 'Ajouter Client'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  <span role="img" aria-label="user">👤</span> Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom complet"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>
                  <span role="img" aria-label="email">📧</span> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Adresse email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>
                  <span role="img" aria-label="phone">📱</span> Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Numéro de téléphone"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>
                  <span role="img" aria-label="key">🔑</span> Mot de passe
                </label>
                <input
                  type="password"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enregistrement...' : (editingId ? 'Mettre à jour' : 'Ajouter')}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                  disabled={isLoading}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .client-management-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .client-management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .client-management-header h2 {
          color: #2c3e50;
          font-size: 1.8rem;
          margin: 0;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background-color: #3498db;
          color: white;
        }
        
        .btn-primary:hover {
          background-color: #2980b9;
        }
        
        .btn-secondary {
          background-color: #95a5a6;
          color: white;
        }
        
        .btn-secondary:hover {
          background-color: #7f8c8d;
        }
        
        .btn-danger {
          background-color: #e74c3c;
          color: white;
        }
        
        .btn-danger:hover {
          background-color: #c0392b;
        }
        
        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 0.5rem;
          border-radius: 50%;
          width: 2.2rem;
          height: 2.2rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .edit-btn {
          color: #3498db;
        }
        
        .edit-btn:hover {
          background-color: rgba(52, 152, 219, 0.1);
        }
        
        .delete-btn {
          color: #e74c3c;
        }
        
        .delete-btn:hover {
          background-color: rgba(231, 76, 60, 0.1);
        }
        
        .table-responsive {
          overflow-x: auto;
          border-radius: 8px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
        }
        
        .client-table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
        }
        
        .client-table th {
          background-color: #34495e;
          color: white;
          padding: 1rem;
          text-align: left;
          font-weight: 500;
        }
        
        .client-table td {
          padding: 0.8rem 1rem;
          border-bottom: 1px solid #ecf0f1;
          color: #2c3e50;
        }
        
        .client-table tr:hover td {
          background-color: #f8f9fa;
        }
        
        .password-field {
          font-family: monospace;
          letter-spacing: 0.1rem;
        }
        
        .actions-cell {
          display: flex;
          gap: 0.5rem;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(3px);
        }
        
        .modal-content {
          background-color: white;
          padding: 2rem;
          border-radius: 10px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }
        
        .modal-content h3 {
          margin-top: 0;
          color: #2c3e50;
        }
        
        .modal-actions, .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.2rem;
        }
        
        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: #7f8c8d;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #dfe6e9;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }
        
        .loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: #7f8c8d;
        }
        
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        .empty-state {
          padding: 3rem;
          text-align: center;
          background-color: white;
          border-radius: 8px;
          color: #95a5a6;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ClientTable;