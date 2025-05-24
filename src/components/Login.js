import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

function Login() {
  const [credentials, setCredentials] = useState({
    nom: '',
    motDePasse: '',
    role: 'agent'
  });
  const [erreur, setErreur] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setIsLoading(true);

    if (credentials.role === 'admin') {
      if (credentials.nom === 'admin' && credentials.motDePasse === '123456') {
        navigate('/reclamations');
      } else {
        setErreur('Nom ou mot de passe admin incorrect');
      }
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = credentials.role === 'agent' 
        ? `${API_URL}/api/agents/login` 
        : `${API_URL}/api/clients/login`;

      const res = await axios.post(endpoint, {
        nom: credentials.nom,
        motDePasse: credentials.motDePasse
      });

      if (res.status === 200 && res.data.id) {
        navigate(credentials.role === 'agent' ? '/reclamations' : '/reclamations');
      } else {
        setErreur('Nom ou mot de passe incorrect');
      }
    } catch (err) {
      setErreur(err.response?.data?.message || 'Nom ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  // Styles intégrés
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(231, 76, 60, 0.1) 100%)',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    },
    card: {
      width: '100%',
      maxWidth: '420px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      animation: 'fadeIn 0.5s ease-out'
    },
    header: {
      padding: '30px',
      textAlign: 'center',
      background: '#2c3e50',
      color: 'white'
    },
    headerTitle: {
      margin: '15px 0 5px',
      fontSize: '1.8rem'
    },
    headerSubtitle: {
      opacity: '0.8',
      fontSize: '0.9rem'
    },
    logo: {
      height: '50px',
      width: 'auto'
    },
    form: {
      padding: '30px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#34495e',
      fontSize: '0.9rem'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '1rem',
      transition: 'border 0.3s ease'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#3498db',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)'
    },
    select: {
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 10px center',
      backgroundSize: '1em'
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px'
    },
    buttonHover: {
      backgroundColor: '#2980b9',
      transform: 'translateY(-2px)'
    },
    buttonDisabled: {
      backgroundColor: '#95a5a6',
      cursor: 'not-allowed',
      transform: 'none'
    },
    alert: {
      padding: '12px',
      borderRadius: '6px',
      marginBottom: '20px',
      fontSize: '0.9rem'
    },
    alertError: {
      backgroundColor: '#fdecea',
      color: '#e74c3c',
      borderLeft: '4px solid #e74c3c'
    },
    footer: {
      padding: '20px',
      textAlign: 'center',
      fontSize: '0.85rem',
      color: '#7f8c8d',
      borderTop: '1px solid #eee'
    },
    link: {
      color: '#3498db',
      textDecoration: 'none'
    },
    linkHover: {
      textDecoration: 'underline'
    },
    // Animation keyframes
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'translateY(10px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={styles.logo} 
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
          <h2 style={styles.headerTitle}>Connexion au système</h2>
          <p style={styles.headerSubtitle}>Veuillez vous identifier pour continuer</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Rôle</label>
            <select
              name="role"
              value={credentials.role}
              onChange={handleChange}
              style={{ ...styles.input, ...styles.select }}
            >
              <option value="agent">Agent SAV</option>
              <option value="client">Client</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nom d'utilisateur</label>
            <input
              type="text"
              name="nom"
              value={credentials.nom}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Entrez votre nom"
              onFocus={(e) => e.target.style = { ...styles.input, ...styles.inputFocus }}
              onBlur={(e) => e.target.style = styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              name="motDePasse"
              value={credentials.motDePasse}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Entrez votre mot de passe"
              onFocus={(e) => e.target.style = { ...styles.input, ...styles.inputFocus }}
              onBlur={(e) => e.target.style = styles.input}
            />
          </div>

          {erreur && <div style={{ ...styles.alert, ...styles.alertError }}>{erreur}</div>}

          <button 
            type="submit" 
            style={isLoading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
            disabled={isLoading}
            onMouseOver={(e) => !isLoading && (e.target.style = { ...styles.button, ...styles.buttonHover })}
            onMouseOut={(e) => !isLoading && (e.target.style = styles.button)}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>Vous n'avez pas de compte? <a href="/inscription" style={styles.link}>Contactez l'admin</a></p>
          <p><a href="/mot-de-passe-oublie" style={styles.link}>Mot de passe oublié?</a></p>
        </div>
      </div>

      {/* Style tag for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Login;