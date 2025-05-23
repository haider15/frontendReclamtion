import React from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const API_URL = process.env.REACT_APP_API_URL;

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  header: {
    marginBottom: '1.5rem',
    color: '#2c3e50',
    fontSize: '1.8rem',
    fontWeight: '600',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  button: {
    padding: '0.6rem 1.2rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#3498db',
    color: 'white',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  buttonPrimary: {
    backgroundColor: '#3498db',
    '&:hover': {
      backgroundColor: '#2980b9',
    },
  },
  buttonSuccess: {
    backgroundColor: '#2ecc71',
    '&:hover': {
      backgroundColor: '#27ae60',
    },
  },
  buttonDanger: {
    backgroundColor: '#e74c3c',
    '&:hover': {
      backgroundColor: '#c0392b',
    },
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '15px',
    textAlign: 'left',
    fontWeight: '500',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    letterSpacing: '0.5px',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #ecf0f1',
    fontSize: '0.9rem',
    color: '#34495e',
  },
  trHover: {
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  actionCell: {
    display: 'flex',
    gap: '0.5rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(3px)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    width: '500px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    marginBottom: '1.5rem',
    color: '#2c3e50',
    fontSize: '1.4rem',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: '1.2rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '6px',
    border: '1px solid #dfe6e9',
    fontSize: '0.95rem',
    transition: 'border-color 0.3s',
    '&:focus': {
      outline: 'none',
      borderColor: '#3498db',
      boxShadow: '0 0 0 2px rgba(52,152,219,0.2)',
    },
  },
  select: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '6px',
    border: '1px solid #dfe6e9',
    fontSize: '0.95rem',
    backgroundColor: 'white',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.7rem top 50%',
    backgroundSize: '0.65rem auto',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  deleteModalContent: {
    textAlign: 'center',
    padding: '2rem',
  },
  deleteModalText: {
    marginBottom: '2rem',
    fontSize: '1.1rem',
    color: '#7f8c8d',
  },
  emptyState: {
    padding: '3rem',
    textAlign: 'center',
    color: '#95a5a6',
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
    const data = response.data;
    if (Array.isArray(data)) {
      this.setState({ reclamations: data });
    } else {
      console.warn('Reclamations API response is not an array:', data);
      this.setState({ reclamations: [] });
    }
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
      alert('Veuillez remplir tous les champs obligatoires.');
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
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('Rapport des Suivis de Réclamations', 105, 15, null, null, 'center');
    
    doc.setFontSize(10);
    doc.setTextColor(149, 165, 166);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 105, 22, null, null, 'center');
    
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    const totalNotes = suivis.reduce((sum, s) => sum + (s.reclamation?.note || 0), 0);
    const moyenne = totalNotes / suivis.length;

    doc.setFontSize(12);
    doc.setTextColor(52, 152, 219);
    doc.text(`Moyenne des Notes: ${moyenne.toFixed(2)}`, 20, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    let y = 45;

    suivis.forEach((s, index) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. Client: ${s.reclamation?.client?.nom || 'Non spécifié'}`, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`   Employé: ${s.employe?.nom || 'Non spécifié'}`, 20, y + 5);
      doc.text(`   Note: ${s.reclamation?.note || 'N/A'}`, 20, y + 10);
      doc.text(`   Description: ${s.reclamation?.description || 'Aucune'}`, 20, y + 15);
      doc.text(`   Produit: ${s.reclamation?.produit || 'Non spécifié'}`, 20, y + 20);
      doc.text(`   Date: ${s.date || 'Non spécifiée'}`, 20, y + 25);
      doc.text(`   Message: ${s.message || 'Aucun'}`, 20, y + 30);
      doc.text(`   Action: ${s.action || 'Aucune'}`, 20, y + 35);
      y += 45;
      
      doc.setDrawColor(236, 240, 241);
      doc.line(20, y, 190, y);
      y += 5;
      
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    
    doc.save(`suivis_reclamations_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  render() {
    const { suivis, employes, reclamations, formData, showModal, editingId, showDeleteModal } = this.state;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Suivis des Réclamations</h2>
          <div style={styles.buttonGroup}>
            <button 
              style={{...styles.button, ...styles.buttonSuccess}} 
              onClick={this.openModalToAdd}
            >
              <i className="fas fa-plus"></i> Ajouter
            </button>
            <button 
              style={{...styles.button, ...styles.buttonPrimary}} 
              onClick={this.generatePDF}
            >
              <i className="fas fa-file-pdf"></i> Générer PDF
            </button>
          </div>
        </div>

        <div style={styles.tableContainer}>
          {suivis.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employé</th>
                  <th style={styles.th}>Réclamation</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Message</th>
                  <th style={styles.th}>Action</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suivis.map((s) => (
                  <tr key={s.id} style={styles.trHover}>
                    <td style={styles.td}>{s.employe?.nom || 'N/A'}</td>
                    <td style={styles.td}>{s.reclamation?.description || 'N/A'}</td>
                    <td style={styles.td}>{s.date || 'N/A'}</td>
                    <td style={styles.td}>{s.message || 'N/A'}</td>
                    <td style={styles.td}>{s.action || 'N/A'}</td>
                    <td style={{...styles.td, ...styles.actionCell}}>
                      <button 
                        style={{...styles.button, padding: '0.4rem 0.8rem', fontSize: '0.8rem'}} 
                        onClick={() => this.openModalToEdit(s)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        style={{...styles.button, ...styles.buttonDanger, padding: '0.4rem 0.8rem', fontSize: '0.8rem'}} 
                        onClick={() => this.openDeleteModal(s.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.emptyState}>
              <p>Aucun suivi de réclamation disponible</p>
            </div>
          )}
        </div>

        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3 style={styles.modalHeader}>{editingId ? 'Modifier' : 'Ajouter'} un Suivi</h3>
              <form onSubmit={this.handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Message *</label>
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
                  <label style={styles.label}>Action *</label>
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
                  <label style={styles.label}>Employé *</label>
                  <select
                    style={styles.select}
                    name="employeId"
                    value={formData.employeId}
                    onChange={this.handleChange}
                    required
                  >
                    <option value="">-- Sélectionner un employé --</option>
                    {employes.map(e => (
                      <option key={e.id} value={e.id}>{e.nom}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Réclamation *</label>
                  <select
                    style={styles.select}
                    name="reclamationId"
                    value={formData.reclamationId}
                    onChange={this.handleChange}
                    required
                  >
                    <option value="">-- Sélectionner une réclamation --</option>
                    {reclamations.map(r => (
                      <option key={r.id} value={r.id}>{r.description}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date *</label>
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
                  <button 
                    type="button" 
                    style={{...styles.button, ...styles.buttonDanger}} 
                    onClick={() => this.setState({ showModal: false, editingId: null })}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    style={{...styles.button, ...styles.buttonSuccess}}
                  >
                    {editingId ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div style={styles.modalOverlay}>
            <div style={{...styles.modalContent, ...styles.deleteModalContent}}>
              <h3 style={styles.modalHeader}>Confirmer la suppression</h3>
              <p style={styles.deleteModalText}>Êtes-vous sûr de vouloir supprimer ce suivi ? Cette action est irréversible.</p>
              <div style={styles.modalButtons}>
                <button 
                  style={{...styles.button, ...styles.buttonDanger}} 
                  onClick={this.cancelDelete}
                >
                  Annuler
                </button>
                <button 
                  style={{...styles.button, ...styles.buttonSuccess}} 
                  onClick={this.handleDelete}
                >
                  Confirmer
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