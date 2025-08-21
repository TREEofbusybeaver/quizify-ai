// src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';

// Define the detail view as a separate component for clarity
const QuizDetailView = ({ quiz, results, isLoading, copyToClipboard }) => {
  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">Select a quiz from the left to view its details.</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-blue-300 mb-4">{quiz.title}</h2>
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">Shareable Link:</p>
        <div className="flex gap-2">
          <input type="text" readOnly value={`${import.meta.env.VITE_PUBLIC_URL}/quiz/${quiz.id}`} className="w-full bg-gray-700 text-gray-300 p-2 rounded-md border border-gray-600"/>
          <button onClick={() => copyToClipboard(quiz.id)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-md transition duration-200">Copy</button>
        </div>
      </div>
      
      <div className="border-t border-gray-700 pt-4 flex-grow">
        <h3 className="text-2xl font-semibold mb-3">Results</h3>
        {isLoading && <p className="text-gray-400">Loading results...</p>}
        {!isLoading && results.length === 0 && <p className="text-gray-400">No one has taken this quiz yet.</p>}
        {!isLoading && results.length > 0 && (
           <ul className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {results.map((result, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                <span className="text-gray-300">{result.name}</span>
                <span className="font-bold text-lg text-green-400">{result.score.toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-gray-700 pt-4 mt-auto">
        <button className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-2 rounded-md transition duration-200" disabled>
          End Test (Feature coming soon)
        </button>
      </div>
    </>
  );
};

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const fetchQuizzes = async () => {
      setLoadingQuizzes(true);
      try {
        const q = query(collection(db, "quizzes"), where("creatorId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userQuizzes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuizzes(userQuizzes);
      } catch (error) {
        toast.error("Failed to fetch quizzes.");
      } finally {
        setLoadingQuizzes(false);
      }
    };
    fetchQuizzes();
  }, [currentUser]);

  useEffect(() => {
    // This effect runs whenever selectedQuizId changes
    if (!selectedQuizId) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoadingResults(true);
      try {
        const resultsRef = collection(db, "quizzes", selectedQuizId, "results");
        const resultsSnapshot = await getDocs(resultsRef);
        const resultsData = resultsSnapshot.docs.map(doc => doc.data()).sort((a, b) => b.score - a.score);
        setResults(resultsData);
      } catch (error) {
        toast.error("Failed to fetch results.");
        setResults([]);
      } finally {
        setLoadingResults(false);
      }
    };
    
    fetchResults();
  }, [selectedQuizId]); // The dependency array is key!

  const copyToClipboard = (quizId) => {
    const link = `${import.meta.env.VITE_PUBLIC_URL}/quiz/${quizId}`;
    navigator.clipboard.writeText(link);
    toast.success("Shareable link copied!");
  };

  const selectedQuiz = quizzes.find(q => q.id === selectedQuizId);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 sm:mb-0">Your Dashboard</h1>
          <button onClick={() => navigate('/editor')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-lg shadow-md">
            + Create New Quiz
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-3">Your Quizzes</h2>
            {loadingQuizzes && <p className="text-gray-400">Loading...</p>}
            {!loadingQuizzes && quizzes.length === 0 && <p className="text-gray-400">You have no quizzes yet.</p>}
            <ul className="space-y-3">
              {quizzes.map(quiz => (
                <li key={quiz.id}>
                  <button 
                    onClick={() => setSelectedQuizId(quiz.id)} // This now only sets the ID
                    className={`w-full text-left p-4 rounded-md transition duration-200 ${selectedQuizId === quiz.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    <span className="font-semibold">{quiz.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 bg-gray-800 p-6 rounded-lg shadow-xl min-h-[50vh] flex flex-col">
            <QuizDetailView 
              quiz={selectedQuiz}
              results={results}
              isLoading={loadingResults}
              copyToClipboard={copyToClipboard}
            />
          </div>
        </div>
      </div>
    </div>
  );
}