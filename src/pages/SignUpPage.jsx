// src/pages/SignUpPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Ensure this path is correct
import toast, { Toaster } from 'react-hot-toast';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validation: Check if passwords match
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (password.length < 6) {
        return toast.error("Password should be at least 6 characters long.");
    }

    setLoading(true);
    try {
      // Use the Firebase function to create a new user
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully!");
      
      // On success, automatically log them in and redirect to the dashboard
      navigate('/dashboard');

    } catch (error) {
      // Display any errors from Firebase (e.g., email already in use)
      toast.error(error.message);
      console.error("Error signing up:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '5rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <Toaster position="top-center" />
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Your Account</h2>
      
      <form onSubmit={handleSignUp}>
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
        
        <div style={{ marginBottom: '1rem' }}>
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

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}