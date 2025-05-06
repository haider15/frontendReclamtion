import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

function Login() {
  const [nom, setNom] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [role, setRole] = useState('agent'); // rôle par défaut
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    if (role === 'admin') {
      if (nom === 'admin' && motDePasse === '123456') {
        navigate('/admin');
      } else {
        setErreur('Nom ou mot de passe admin incorrect');
      }
      return;
    }

    // Préparer l’endpoint selon le rôle
    let endpoint = '';
    if (role === 'agent') {
      endpoint = `${API_URL}/api/agents/login`;
    } else if (role === 'client') {
      endpoint = `${API_URL}/api/clients/login`;
    }

    try {
      const res = await axios.post(endpoint, { nom, motDePasse });

      if (res.status === 200 && res.data.id) {
        // Rediriger selon le rôle
        if (role === 'agent') {
          navigate('/agents');
        } else if (role === 'client') {
          navigate('/clients');
        }
      } else {
        setErreur('Nom ou mot de passe incorrect');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err.response);
      setErreur(err.response?.data?.message || 'Nom ou mot de passe incorrect');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Rôle:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
          >
            <option value="agent">Agent SAV</option>
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nom:</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Mot de passe:</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Se connecter</button>
        {erreur && <p style={styles.error}>{erreur}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
    padding: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  inputGroup: {
    marginBottom: '15px'
  },
  label: {
    fontSize: '14px',
    marginBottom: '5px'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px'
  }
};

export default Login;
