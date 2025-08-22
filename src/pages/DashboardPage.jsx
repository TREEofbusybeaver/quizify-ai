// src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
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
        // Add isActive=true to older quizzes that don't have this field
        const quizzesWithStatus = userQuizzes.map(q => ({...q, isActive: q.isActive !== false }));
        setQuizzes(quizzesWithStatus);
      } catch (error) { toast.error("Failed to fetch quizzes."); } 
      finally { setLoadingQuizzes(false); }
    };
    fetchQuizzes();
  }, [currentUser]);

  const handleSelectQuiz = async (quiz) => {
    setSelectedQuiz(quiz);
    setLoadingResults(true);
    try {
      const resultsRef = collection(db, "quizzes", quiz.id, "results");
      const resultsSnapshot = await getDocs(resultsRef);
      const resultsData = resultsSnapshot.docs.map(doc => doc.data()).sort((a, b) => b.score - a.score);
      setResults(resultsData);
    } catch (error) { toast.error("Failed to fetch results."); } 
    finally { setLoadingResults(false); }
  };

  const copyToClipboard = (quizId) => {
    const link = `${import.meta.env.VITE_PUBLIC_URL}/quiz/${quizId}`;
    navigator.clipboard.writeText(link);
    toast.success("Shareable link copied!");
  };

  const handleToggleQuizStatus = async (quizId, currentStatus) => {
    const newStatus = !currentStatus;
    const text = newStatus ? "reactivate this quiz?" : "end this quiz? The link will become inaccessible.";
    if (window.confirm(`Are you sure you want to ${text}`)) {
      const quizRef = doc(db, "quizzes", quizId);
      try {
        await updateDoc(quizRef, { isActive: newStatus });
        const updatedQuizzes = quizzes.map(q => q.id === quizId ? { ...q, isActive: newStatus } : q);
        setQuizzes(updatedQuizzes);
        setSelectedQuiz(prev => ({...prev, isActive: newStatus}));
        toast.success(`Quiz has been ${newStatus ? 'activated' : 'deactivated'}.`);
      } catch (error) { toast.error("Failed to update quiz status."); }
    }
  };

  return (
    <div className="min-h-screen neon-bg">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 sm:mb-0 neon-text-main filter drop-shadow-glow-cyan">Your Arsenal</h1>
          <button onClick={() => navigate('/editor')} className="neon-button neon-button-primary">
            + Create New Quiz
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 neon-card-glass">
            <h2 className="text-2xl font-semibold mb-4 border-b border-neon-cyan/30 pb-3 text-cyan-200">Your Quizzes</h2>
            {loadingQuizzes && <p className="text-cyan-400">Loading...</p>}
            {!loadingQuizzes && quizzes.length === 0 && <p className="text-cyan-400">You have no quizzes yet.</p>}
            <ul className="space-y-3">
              {quizzes.map(quiz => (
                <li key={quiz.id}>
                  <button onClick={() => handleSelectQuiz(quiz)} className={`w-full text-left p-4 rounded-md transition duration-200 ${selectedQuiz?.id === quiz.id ? 'bg-neon-cyan/20' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    <span className="font-semibold text-white">{quiz.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 neon-card-glass min-h-[50vh] flex flex-col">
            {selectedQuiz ? (
              <>
                <h2 className="text-3xl font-bold text-cyan-300 mb-4">{selectedQuiz.title}</h2>
                <div className="mb-6">
                  <p className="text-sm text-cyan-400 mb-1">Shareable Link:</p>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={`${import.meta.env.VITE_PUBLIC_URL}/quiz/${selectedQuiz.id}`} className="neon-input flex-grow"/>
                    <button onClick={() => copyToClipboard(selectedQuiz.id)} className="neon-button neon-button-primary !py-2 !px-4">Copy</button>
                  </div>
                </div>
                <div className="border-t border-neon-cyan/30 pt-4 flex-grow">
                  <h3 className="text-2xl font-semibold mb-3 text-cyan-200">Results</h3>
                  {loadingResults && <p className="text-cyan-400">Loading results...</p>}
                  {!loadingResults && results.length === 0 && <p className="text-cyan-400">No one has taken this quiz yet.</p>}
                  {!loadingResults && results.length > 0 && (
                     <ul className="space-y-2 max-h-80 overflow-y-auto pr-2">
                      {results.map((result, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-md">
                          <span className="text-gray-300">{result.name}</span>
                          <span className="font-bold text-lg text-green-400">{result.score.toFixed(0)}%</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="border-t border-neon-cyan/30 pt-4 mt-auto">
                  <button onClick={() => handleToggleQuizStatus(selectedQuiz.id, selectedQuiz.isActive)} className={`w-full neon-button ${selectedQuiz.isActive ? 'neon-button-secondary' : 'neon-button-primary'}`}>
                    {selectedQuiz.isActive ? 'End Test' : 'Reactivate Test'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-xl">Select a quiz from the left to view its details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}