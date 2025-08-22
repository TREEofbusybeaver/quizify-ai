// src/pages/HomePage.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Determine the correct "Start Creating" link based on auth status
  const startCreatingLink = currentUser ? "/dashboard" : "/signup";

  return (
    <div className="min-h-screen neon-bg flex items-center justify-center">
      <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
        <div>
          <h1 className="text-7xl font-bold mb-4 neon-text-main filter drop-shadow-glow-cyan font-display">
            QUIZIFY AI
          </h1>
          <p className="text-2xl neon-text-sub filter drop-shadow-glow-magenta mb-8">
            Create • Share • Challenge • Dominate
          </p>
        </div>
        
        <div className="space-y-6">
          <p className="text-xl text-cyan-200 max-w-2xl mx-auto leading-relaxed">
            Unleash the power of AI to generate mind-bending quizzes from any text. 
            Share with friends, track scores, and watch the knowledge wars begin.
          </p>
          
          <div className="flex gap-6 justify-center flex-wrap">
            <Link to={startCreatingLink} className="neon-button neon-button-primary font-display">
              START CREATING
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
          <div className="neon-card-glass">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-xl font-bold text-cyan-300 mb-2">AI-Powered</h3>
            <p className="text-cyan-100">Paste any text and watch AI generate perfect multiple-choice questions.</p>
          </div>
          
          <div className="neon-card-glass">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-cyan-300 mb-2">Lightning Fast</h3>
            <p className="text-cyan-100">Create and share quizzes in seconds, no complex setup required.</p>
          </div>
          
          <div className="neon-card-glass">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-cyan-300 mb-2">Track Results</h3>
            <p className="text-cyan-100">See who's crushing your quizzes and dominating the leaderboards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}