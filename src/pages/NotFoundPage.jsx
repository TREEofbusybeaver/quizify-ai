// src/pages/NotFoundPage.jsx

import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" style={{
        marginTop: '1.5rem',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px'
      }}>
        Go to Homepage
      </Link>
    </div>
  );
}