import React from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const API_URL = process.env.REACT_APP_API_URL;

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: 1000,
    margin: 'auto',
  },
  header: {
    marginBottom: '1rem',
    color: '#333',
  },
  button: {
    marginRight: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: 4,
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    transition: 'background-color 0.3s',
  },
  buttonDanger: {
    backgroundColor: '#f44336',
  },
  buttonSecondary: {
    backgroundColor: '#2196F3',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '12px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  trHover: {
    backgroundColor: '#f9f9f9',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: 8,
    width: '400px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  select: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
  },
};

class SuiviReclamationTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suivis: [],
      employes: [],
      reclamations: [],
      formData: {
        message: '',
        action: '',
        employeId: '',
        reclamationId: '',
        date: '',
      },
      editingId: null,
      showModal: false,
      showDeleteModal: false,
      deletingId: null,
    };
  }

  componentDidMount() {
    this.fetchSuivis();
    this.fetchEmployes();
    this.fetchReclamations();
  }

  fetchSuivis = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/suivis`);
      this.setState({ suivis: response.data });
    } catch (err) {
      console.error('Erreur de chargement des suivis :', err);
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

  fetchReclamations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reclamations`);
      this.setState({ reclamations: response.data });
    } catch (err) {
      console.error('Erreur chargement réclamations :', err);
    }
  };

  openModalToAdd = () => {
    this.setState({
      formData: {
        message: '',
        action: '',
        employeId: '',
        reclamationId: '',
        date: '',
      },
      editingId: null,
      showModal: true,
    });
  };

  openModalToEdit = (suivi) => {
    this.setState({
      formData: {
        message: suivi.message || '',
        action: suivi.action || '',
        employeId: suivi.employe?.id || '',
        reclamationId: suivi.reclamation?.id || '',
        date: suivi.date ? suivi.date.substring(0, 10) : '',
      },
      editingId: suivi.id,
      showModal: true,
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { editingId, formData } = this.state;

    if (!formData.message || !formData.action || !formData.employeId || !formData.reclamationId || !formData.date) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const payload = {
      message: formData.message,
      action: formData.action,
      date: formData.date,
      employe: { id: formData.employeId },
      reclamation: { id: formData.reclamationId },
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/suivis/${editingId}`, payload);
      } else {
        await axios.post(`${API_URL}/api/suivis`, payload);
      }
      this.setState({ showModal: false, editingId: null });
      this.fetchSuivis();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du suivi :', err);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  openDeleteModal = (id) => {
    this.setState({ deletingId: id, showDeleteModal: true });
  };

  handleDelete = async () => {
    const { deletingId } = this.state;
    try {
      await axios.delete(`${API_URL}/api/suivis/${deletingId}`);
      this.setState({ showDeleteModal: false, deletingId: null });
      this.fetchSuivis();
    } catch (err) {
      console.error('Erreur suppression :', err);
      alert('Erreur lors de la suppression.');
    }
  };

  cancelDelete = () => {
    this.setState({ showDeleteModal: false, deletingId: null });
  };

  generatePDF = () => {
    const { suivis } = this.state;
    if (suivis.length === 0) {
      alert('Aucun suivi disponible pour générer un PDF.');
      return;
    }

    const doc = new jsPDF();
    const totalNotes = suivis.reduce((sum, s) => sum + (s.reclamation?.note || 0), 0);
    const moyenne = totalNotes / suivis.length;

    doc.setFontSize(14);
    doc.text(`Moyenne des Notes: ${moyenne.toFixed(2)}`, 10, 10);
    let y = 20;

    suivis.forEach((s, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. Client: ${s.reclamation?.client?.nom || ''}`, 10, y);
      doc.text(`   Employé: ${s.employe?.nom || ''}`, 10, y + 5);
      doc.text(`   Note: ${s.reclamation?.note || ''}`, 10, y + 10);
      doc.text(`   Description: ${s.reclamation?.description || ''}`, 10, y + 15);
      doc.text(`   Produit: ${s.reclamation?.produit || ''}`, 10, y + 20);
      doc.text(`   Date: ${s.date || ''}`, 10, y + 25);
      doc.text(`   Message: ${s.message || ''}`, 10, y + 30);
      doc.text(`   Action: ${s.action || ''}`, 10, y + 35);
      y += 50;
      doc.text('---------------------------------------------', 10, y);
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save('suivis.pdf');
  };

  render() {
    const { suivis, employes, reclamations, formData, showModal, editingId, showDeleteModal } = this.state;

    return (
      <div style={styles.container}>
        <h2 style={styles.header}>Suivis des Réclamations</h2>
        <button style={styles.button} onClick={this.openModalToAdd}>Ajouter un Suivi</button>
        <button style={{...styles.button, ...styles.buttonSecondary}} onClick={this.generatePDF}>Générer PDF</button>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Employé</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Message</th>
              <th style={styles.th}>Action</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suivis.map((s) => (
              <tr key={s.id} style={{ cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9f9f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = ''}>
                <td style={styles.td}>{s.employe?.nom}</td>
                <td style={styles.td}>{s.reclamation?.description}</td>
                <td style={styles.td}>{s.date}</td>
                <td style={styles.td}>{s.message}</td>
                <td style={styles.td}>{s.action}</td>
                <td style={styles.td}>
                  <button style={{...styles.button, fontSize: '0.9rem', marginRight: '0.5rem'}} onClick={() => this.openModalToEdit(s)}>Modifier</button>
                  <button style={{...styles.button, ...styles.buttonDanger, fontSize: '0.9rem'}} onClick={() => this.openDeleteModal(s.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3>{editingId ? 'Modifier' : 'Ajouter'} un Suivi</h3>
              <form onSubmit={this.handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Message:</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="message"
                    value={formData.message}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Action:</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="action"
                    value={formData.action}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Employé:</label>
                  <select
                    style={styles.select}
                    name="employeId"
                    value={formData.employeId}
                    onChange={this.handleChange}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {employes.map(e => (
                      <option key={e.id} value={e.id}>{e.nom}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Réclamation:</label>
                  <select
                    style={styles.select}
                    name="reclamationId"
                    value={formData.reclamationId}
                    onChange={this.handleChange}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {reclamations.map(r => (
                      <option key={r.id} value={r.id}>{r.description}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date:</label>
                  <input
                    style={styles.input}
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div style={styles.modalButtons}>
                  <button type="submit" style={{...styles.button, fontSize: '1rem'}}>
                    {editingId ? 'Modifier' : 'Ajouter'}
                  </button>
                  <button type="button" style={{...styles.button, ...styles.buttonDanger, fontSize: '1rem'}} onClick={() => this.setState({ showModal: false, editingId: null })}>
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
              <h3>Confirmer la suppression</h3>
              <p>Êtes-vous sûr de vouloir supprimer ce suivi ?</p>
              <div style={styles.modalButtons}>
                <button style={{...styles.button, fontSize: '1rem'}} onClick={this.handleDelete}>Oui</button>
                <button style={{...styles.button, ...styles.buttonDanger, fontSize: '1rem'}} onClick={this.cancelDelete}>Non</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SuiviReclamationTable;
