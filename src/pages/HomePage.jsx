// src/pages/HomePage.jsx

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import our custom hook

export default function HomePage() {
  const { currentUser } = useAuth(); // Get the current user state

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem',
      marginTop: '5rem'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Welcome to Quizify AI
      </h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '600px', color: '#555', marginBottom: '2rem' }}>
        The smartest way to create and share quizzes. Build quizzes manually or let our AI generate them for you from any text in seconds.
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {currentUser ? (
          // If the user is logged in, show a link to their dashboard
          <Link to="/dashboard" style={styles.button}>
            Go to Your Dashboard
          </Link>
        ) : (
          // If the user is not logged in, show links to sign up or log in
          <>
            <Link to="/signup" style={styles.button}>
              Get Started for Free
            </Link>
            <Link to="/login" style={{ ...styles.button, ...styles.secondaryButton }}>
              I have an account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

// Simple styling object for consistency
const styles = {
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer'
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  }
};