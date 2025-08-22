// src/pages/SignUpPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import toast, { Toaster } from 'react-hot-toast';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Resistance joined. Welcome.");
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Added pt-24 to create space for the sticky navbar
    <div className="min-h-screen neon-bg flex items-center justify-center p-4 pt-24">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <div className="neon-card-glass max-w-md w-full glow-on-hover-magenta">
        <h2 className="text-3xl font-bold text-center neon-text-sub mb-8 font-display filter drop-shadow-glow-magenta">
          JOIN THE RESISTANCE
        </h2>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="neon-input" 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="neon-input" 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              className="neon-input" 
            />
          </div>
          <button type="submit" disabled={loading} className="neon-button neon-button-secondary w-full font-display">
            {loading ? 'INITIALIZING...' : 'SIGN UP'}
          </button>
        </form>
        <p className="text-center mt-6 text-cyan-300">
          Already have access? <Link to="/login" className="font-bold text-neon-cyan hover:underline">Login Here</Link>
        </p>
      </div>
    </div>
  );
}