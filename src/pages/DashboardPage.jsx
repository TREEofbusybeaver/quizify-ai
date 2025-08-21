// src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State to hold the data of the currently selected quiz for the detail view
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  useEffect(() => {
    // Fetch the list of quizzes (left panel)
    const fetchQuizzes = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const q = query(collection(db, "quizzes"), where("creatorId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userQuizzes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuizzes(userQuizzes);
      } catch (error) {
        toast.error("Failed to fetch quizzes.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [currentUser]);

  // Function to handle selecting a quiz from the list
  const handleSelectQuiz = async (quiz) => {
    setSelectedQuiz(quiz);
    setResultsLoading(true);
    try {
      const resultsRef = collection(db, "quizzes", quiz.id, "results");
      const resultsSnapshot = await getDocs(resultsRef);
      const resultsData = resultsSnapshot.docs.map(doc => doc.data()).sort((a, b) => b.score - a.score);
      setResults(resultsData);
    } catch (error) {
      toast.error("Failed to fetch results.");
    } finally {
      setResultsLoading(false);
    }
  };

  const copyToClipboard = (quizId) => {
    const baseUrl = import.meta.env.VITE_PUBLIC_URL; // <<< NEW LINE
    const link = `${baseUrl}/quiz/${quizId}`;        // <<< UPDATED LINE
    navigator.clipboard.writeText(link);
    toast.success("Shareable link copied!");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        {/* --- Header --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 sm:mb-0">Your Dashboard</h1>
          <button onClick={() => navigate('/editor')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-lg shadow-md">
            + Create New Quiz
          </button>
        </div>

        {/* --- Main Split-Screen Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* --- Left Column: Quiz List --- */}
          <div className="md:col-span-1 bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-3">Your Quizzes</h2>
            {loading && <p className="text-gray-400">Loading...</p>}
            {!loading && quizzes.length === 0 && <p className="text-gray-400">You have no quizzes yet.</p>}
            <ul className="space-y-3">
              {quizzes.map(quiz => (
                <li key={quiz.id}>
                  <button 
                    onClick={() => handleSelectQuiz(quiz)}
                    className={`w-full text-left p-4 rounded-md transition duration-200 ${selectedQuiz?.id === quiz.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    <span className="font-semibold">{quiz.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Right Column: Detail View --- */}
          <div className="md:col-span-2 bg-gray-800 p-6 rounded-lg shadow-xl min-h-[50vh] flex flex-col">
            {selectedQuiz ? (
              // If a quiz is selected, show its details
              <>
                <h2 className="text-3xl font-bold text-blue-300 mb-4">{selectedQuiz.title}</h2>
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-1">Shareable Link:</p>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={`${import.meta.env.VITE_PUBLIC_URL}/quiz/${quiz.id}`}  className="w-full bg-gray-700 text-gray-300 p-2 rounded-md border border-gray-600"/>
                    <button onClick={() => copyToClipboard(selectedQuiz.id)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-md transition duration-200">Copy</button>
                  </div>
                </div>
                
                {/* --- Results Section --- */}
                <div className="border-t border-gray-700 pt-4 flex-grow">
                  <h3 className="text-2xl font-semibold mb-3">Results</h3>
                  {resultsLoading && <p className="text-gray-400">Loading results...</p>}
                  {!resultsLoading && results.length === 0 && <p className="text-gray-400">No one has taken this quiz yet.</p>}
                  {!resultsLoading && results.length > 0 && (
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

                {/* --- Actions Section (e.g., End Test) --- */}
                <div className="border-t border-gray-700 pt-4 mt-auto">
                  <button className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-2 rounded-md transition duration-200" disabled>
                    End Test (Feature coming soon)
                  </button>
                </div>
              </>
            ) : (
              // If no quiz is selected, show a placeholder
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-lg">Select a quiz from the left to view its details.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}