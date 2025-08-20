// src/pages/TakeQuizPage.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';

export default function TakeQuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [takerName, setTakerName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  // 1. Fetch the quiz data based on URL parameter
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, "quizzes", quizId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuiz({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Quiz not found!");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast.error("Failed to load the quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);
  
  // 2. Handle quiz flow
  const handleStartQuiz = (e) => {
    e.preventDefault();
    if (!takerName.trim()) {
      return toast.error("Please enter your name.");
    }
    setQuizStarted(true);
  };
  
  const handleAnswerSelect = (qIndex, oIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [qIndex]: oIndex
    });
  };

  const handleSubmitQuiz = async () => {
    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    const finalScore = (correctAnswers / quiz.questions.length) * 100;
    setScore(finalScore);

    // Save results to Firestore
    try {
      const resultsCollectionRef = collection(db, "quizzes", quizId, "results");
      await addDoc(resultsCollectionRef, {
        name: takerName,
        score: finalScore,
        submittedAt: new Date()
      });
    } catch (error) {
      console.error("Error saving results:", error);
      toast.error("There was an issue submitting your score.");
    }
    
    setQuizFinished(true);
  };

  // 3. Render different UI based on quiz state
  if (loading) return <p>Loading Quiz...</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  if (quizFinished) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h1>Quiz Complete!</h1>
        <p>Thank you for taking the quiz, {takerName}.</p>
        <h2>Your Score: {score.toFixed(2)}%</h2>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div style={{ maxWidth: '400px', margin: '5rem auto', textAlign: 'center' }}>
        <Toaster />
        <h1>{quiz.title}</h1>
        <form onSubmit={handleStartQuiz}>
          <input
            type="text"
            value={takerName}
            onChange={(e) => setTakerName(e.target.value)}
            placeholder="Enter your name to start"
            style={{ width: '100%', padding: '10px', marginBottom: '1rem' }}
          />
          <button type="submit" style={{ width: '100%', padding: '10px' }}>Start Quiz</button>
        </form>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <h1>{quiz.title}</h1>
      <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
        <h3>Question {currentQuestionIndex + 1} of {quiz.questions.length}</h3>
        <p style={{ fontSize: '1.2rem' }}>{currentQuestion.text}</p>
        <div>
          {currentQuestion.options.map((option, index) => (
            <div key={index} style={{ margin: '0.5rem 0' }}>
              <button
                onClick={() => handleAnswerSelect(currentQuestionIndex, index)}
                style={{ 
                  width: '100%', padding: '10px', textAlign: 'left',
                  background: selectedAnswers[currentQuestionIndex] === index ? '#007bff' : '#f0f0f0',
                  color: selectedAnswers[currentQuestionIndex] === index ? 'white' : 'black'
                }}
              >
                {option}
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} disabled={selectedAnswers[currentQuestionIndex] === undefined}>
              Next
            </button>
          ) : (
            <button onClick={handleSubmitQuiz} disabled={selectedAnswers[currentQuestionIndex] === undefined}>
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}