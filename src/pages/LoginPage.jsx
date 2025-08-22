import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Connection established.");
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen neon-bg flex items-center justify-center p-4">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <div className="neon-card-glass max-w-md w-full">
        <h2 className="text-3xl font-bold text-center neon-text-main mb-8 filter drop-shadow-glow-cyan font-display">
          ENTER THE MATRIX
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="neon-input" /></div>
          <div><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="neon-input" /></div>
          <button type="submit" disabled={loading} className="neon-button neon-button-primary w-full font-display">
            {loading ? 'CONNECTING...' : 'LOGIN'}
          </button>
        </form>
        <p className="text-center mt-6 text-cyan-300">
          New to the resistance? <Link to="/signup" className="font-bold text-neon-magenta hover:underline">Join Now</Link>
        </p>
      </div>
    </div>
  );
}