// src/components/Navbar.jsx

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("You have been logged out.");
    navigate('/');
  };

  const activeLinkStyle = {
    color: 'var(--neon-cyan)',
    textShadow: '0 0 5px rgba(var(--neon-cyan-rgb), 0.7)',
  };

  return (
    // The key changes: `sticky top-0` and `bg-dark-bg/80 backdrop-blur-lg`
    <nav className="bg-dark-bg/60 backdrop-blur-lg border-b border-neon-cyan/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl font-bold neon-text-main font-display filter drop-shadow-glow-cyan">
              Quizify AI
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {currentUser ? (
              <>
                <NavLink to="/dashboard" className="text-gray-300 hover:text-white transition duration-200 text-lg font-sans" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                  Dashboard
                </NavLink>
                <button onClick={handleLogout} className="font-display uppercase tracking-wider text-neon-magenta border-2 border-neon-magenta rounded-md py-2 px-5 transition-all duration-300 hover:bg-neon-magenta/10 hover:shadow-glow-magenta">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="text-gray-300 hover:text-white transition duration-200 text-lg font-sans" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                  Login
                </NavLink>
                <NavLink to="/signup" className="font-display uppercase tracking-wider text-neon-cyan border-2 border-neon-cyan rounded-md py-2 px-5 transition-all duration-300 hover:bg-neon-cyan/10 hover:shadow-glow-cyan">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}