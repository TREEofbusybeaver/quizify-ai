// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen neon-bg flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-9xl font-extrabold neon-text-main font-display filter drop-shadow-glow-cyan">404</h1>
      <h2 className="text-4xl font-bold mt-2 font-display text-white">SYSTEM ERROR</h2>
      <p className="mt-4 text-lg text-gray-300">Signal lost... The page you are looking for does not exist.</p>
      <Link to="/" className="neon-button neon-button-primary font-display mt-8">
        Return to Base
      </Link>
    </div>
  );
}