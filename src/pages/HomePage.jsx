import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className="bg-gray-900 text-white min-h-[90vh] flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in">
          Welcome to <span className="text-blue-400">Quizify AI</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          The smartest way to create and share quizzes. Build quizzes manually or let our AI generate them for you from any text in seconds.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        {currentUser ? (
          <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
            Go to Your Dashboard
          </Link>
        ) : (
          <>
            <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
              Get Started for Free
            </Link>
            <Link to="/login" className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
              I have an account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}