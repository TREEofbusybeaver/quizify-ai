// src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("You have been logged out.");
      navigate('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error("Failed to log out:", error);
      toast.error("Failed to log out.");
    }
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        Quizify AI
      </Link>
      <div style={styles.navLinks}>
        {currentUser ? (
          // --- Logged In User View ---
          <>
            <Link to="/dashboard" style={styles.link}>
              Dashboard
            </Link>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          // --- Logged Out User View ---
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/signup" style={styles.button}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// --- Basic Styling ---
const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  link: {
    textDecoration: 'none',
    color: '#555',
    fontSize: '1rem'
  },
  button: {
    textDecoration: 'none',
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  }
};