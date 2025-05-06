import React from 'react';
import axios from 'axios';
import jsPDF from 'jspdf'; // Importer la bibliothèque jsPDF

const API_URL = process.env.REACT_APP_API_URL;

class SuiviReclamationTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suivis: [],
      clients: [],
      employes: [],
      formData: {
        message: '',
        action: '',
        note: '',
        description: '',
        produit: '',
        clientId: '',
        employeId: '',
      },
      editingId: null,
      showModal: false,
      showDeleteModal: false,
      deletingId: null,
      reclamationId: ''
    };
  }

  componentDidMount() {
    this.fetchSuivis();
    this.fetchClients();
    this.fetchEmployes();
  }

  fetchSuivis = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/suivis`);
      this.setState({ suivis: response.data });
    } catch (err) {
      console.error('Erreur de chargement des suivis :', err);
    }
  };

  fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/clients`);
      this.setState({ clients: response.data });
    } catch (err) {
      console.error('Erreur chargement clients :', err);
    }
  };

  fetchEmployes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/agents`);
      this.setState({ employes: response.data });
    } catch (err) {
      console.error('Erreur chargement employés :', err);
    }
  };

  openModalToAdd = () => {
    this.setState({
      formData: {
        message: '',
        action: '',
        note: '',
        description: '',
        produit: '',
        clientId: '',
        employeId: '',
      },
      editingId: null,
      showModal: true
    });
  };

  openModalToEdit = (suivi) => {
    this.setState({
      formData: {
        message: suivi.message,
        action: suivi.action,
        note: suivi.reclamation.note,
        description: suivi.reclamation.description,
        produit: suivi.reclamation.produit,
        clientId: suivi.reclamation.client.id,
        employeId: suivi.employe.id,
      },
      editingId: suivi.id,
      showModal: true
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { editingId, formData, reclamationId } = this.state;
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/suivis/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/api/suivis/${reclamationId}/suivi`, formData);
      }
      this.setState({ showModal: false });
      this.fetchSuivis();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du suivi :', err);
    }
  };

  openDeleteModal = (id) => {
    this.setState({ deletingId: id, showDeleteModal: true });
  };

  handleDelete = async () => {
    const { deletingId } = this.state;
    try {
      await axios.delete(`${API_URL}/api/suivis/${deletingId}`);
      this.setState({ showDeleteModal: false });
      this.fetchSuivis();
    } catch (err) {
      console.error('Erreur suppression :', err);
    }
  };

  cancelDelete = () => {
    this.setState({ showDeleteModal: false, deletingId: null });
  };

  // Méthode pour générer un PDF
  generatePDF = () => {
    const { suivis } = this.state;
    const doc = new jsPDF();
  
    // Calcul de la moyenne des notes
    const totalNotes = suivis.reduce((sum, suivi) => sum + suivi.reclamation.note, 0);
    const moyenne = totalNotes / suivis.length;
  
    // Ajouter la moyenne au-dessus de la page
    doc.setFontSize(14);
    doc.text(`Moyenne des Notes: ${moyenne.toFixed(2)}`, 10, 10); // Affiche la moyenne avec 2 décimales
  
    let yPosition = 20;
    suivis.forEach((suivi, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. Client: ${suivi.reclamation.client.nom}`, 10, yPosition);
      doc.text(`   Employé: ${suivi.employe.nom}`, 10, yPosition + 5);
      doc.text(`   Note: ${suivi.reclamation.note}`, 10, yPosition + 10);
      doc.text(`   Description: ${suivi.reclamation.description}`, 10, yPosition + 15);
      doc.text(`   Produit: ${suivi.reclamation.produit}`, 10, yPosition + 20);
      doc.text(`   Message: ${suivi.message}`, 10, yPosition + 25);
      doc.text(`   Action: ${suivi.action}`, 10, yPosition + 30);
  
      // Ajouter un espace après chaque suivi
      yPosition += 35;
  
      // Ajouter une ligne de séparation
      doc.setFont('courier', 'normal');
      doc.text('--------------------------------------------------------------------', 10, yPosition);
  
      // Mettre à jour la position pour le prochain suivi
      yPosition += 10;
  
      // Si la position dépasse la limite de la page, on ajoute une nouvelle page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
  
        // Ajouter la moyenne sur la nouvelle page
        doc.setFontSize(14);
        doc.text(`Moyenne des Notes: ${moyenne.toFixed(2)}`, 10, 10); // Affiche la moyenne sur chaque page
      }
    });
  
    doc.save('suivis_reclamations.pdf');
  };
  
  render() {
    const { suivis, clients, employes, formData, showModal, editingId, showDeleteModal } = this.state;

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

        <button style={styles.button} onClick={this.openModalToAdd}>➕ Ajouter un suivi</button>
        <button style={styles.button} onClick={this.generatePDF}>📄 Générer PDF</button>

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
                  <button style={styles.iconBtn} onClick={() => this.openModalToEdit(suivi)}>✏️</button>
                  <button style={{ ...styles.iconBtn, color: 'red' }} onClick={() => this.openDeleteModal(suivi.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3>{editingId ? 'Modifier Suivi' : 'Ajouter Suivi'}</h3>
              <form onSubmit={this.handleSubmit}>
                <select
                  style={styles.modalInput}
                  name="clientId"
                  value={formData.clientId}
                  onChange={this.handleChange}
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
                  onChange={this.handleChange}
                  required
                >
                  <option value="">Sélectionner un employé</option>
                  {employes.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.nom}</option>
                  ))}
                </select>

                {['message', 'action', 'note', 'description', 'produit'].map(field => (
                  <input
                    key={field}
                    style={styles.modalInput}
                    name={field}
                    value={formData[field]}
                    onChange={this.handleChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    required
                  />
                ))}

                <div style={styles.modalActions}>
                  <button type="submit" style={{ ...styles.button, backgroundColor: '#007bff' }}>
                    {editingId ? 'Enregistrer' : 'Ajouter'}
                  </button>
                  <button type="button" style={{ ...styles.button, backgroundColor: '#6c757d' }} onClick={() => this.setState({ showModal: false })}>
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
                <button style={{ ...styles.button, backgroundColor: '#dc3545' }} onClick={this.handleDelete}>
                  Supprimer
                </button>
                <button style={{ ...styles.button, backgroundColor: '#6c757d' }} onClick={this.cancelDelete}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SuiviReclamationTable;
