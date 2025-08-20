// src/pages/LoginPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Make sure this path is correct
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    
    if (!email || !password) {
      return toast.error("Please fill in all fields.");
    }

    setLoading(true);
    try {
      // Use the Firebase function to sign in
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      
      // On success, redirect the user to their dashboard
      navigate('/dashboard');

    } catch (error) {
      // If Firebase returns an error, show it to the user
      toast.error(error.message);
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '5rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <Toaster position="top-center" />
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login to Quizify AI</h2>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: loading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}