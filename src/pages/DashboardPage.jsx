// src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // This effect runs when the component mounts to fetch the user's quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!currentUser) return;
      try {
        // Create a query to get quizzes where 'creatorId' matches the current user's ID
        const q = query(collection(db, "quizzes"), where("creatorId", "==", currentUser.uid));
        
        const querySnapshot = await getDocs(q);
        const userQuizzes = [];
        querySnapshot.forEach((doc) => {
          // Push the quiz data and its unique ID to our array
          userQuizzes.push({ id: doc.id, ...doc.data() });
        });
        
        setQuizzes(userQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes: ", error);
        toast.error("Failed to fetch your quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [currentUser]); // Re-run the effect if the user changes

  const copyToClipboard = (quizId) => {
    const link = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(link);
    toast.success("Shareable link copied to clipboard!");
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <Toaster position="top-center" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Your Dashboard</h1>
        <button 
          onClick={() => navigate('/editor')}
          style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          + Create New Quiz
        </button>
      </div>

      {loading && <p>Loading your quizzes...</p>}

      {!loading && quizzes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3>You haven't created any quizzes yet.</h3>
          <p>Click the "Create New Quiz" button to get started!</p>
        </div>
      )}

      {!loading && quizzes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {quizzes.map(quiz => (
            <div key={quiz.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
              <h3 style={{ marginTop: 0 }}>{quiz.title}</h3>
              <p>Shareable Link:</p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/quiz/${quiz.id}`}
                  style={{ flexGrow: 1, padding: '8px', border: '1px solid #ddd' }}
                />
                <button onClick={() => copyToClipboard(quiz.id)}>Copy</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}