// src/pages/TakeQuizPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDocFromServer, collection, addDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';

// Utility function to check if two arrays are equal regardless of order
const arraysAreEqual = (arr1 = [], arr2 = []) => {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((value, index) => value === sorted2[index]);
};

export default function TakeQuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [takerName, setTakerName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [quizError, setQuizError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setQuiz(null);
      setQuizError(null);
      try {
        const docRef = doc(db, "quizzes", quizId);
        const docSnap = await getDocFromServer(docRef);
        if (docSnap.exists()) {
          const quizData = docSnap.data();
          if (quizData.isActive === false) {
            setQuizError("This quiz has been deactivated by the creator.");
          } else {
            setQuiz({ id: docSnap.id, ...quizData });
            // Initialize answer state correctly
            const initialAnswers = {};
            quizData.questions.forEach((q, index) => {
              initialAnswers[index] = q.questionType === 'multiple' ? [] : undefined;
            });
            setSelectedAnswers(initialAnswers);
          }
        } else {
          setQuizError("Quiz not found!");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setQuizError("Failed to load the quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleStartQuiz = (e) => {
    e.preventDefault();
    if (!takerName.trim()) return toast.error("Please enter your name.");
    setQuizStarted(true);
  };

  const handleAnswerSelect = (qIndex, oIndex) => {
    const question = quiz.questions[qIndex];
    const currentSelection = selectedAnswers[qIndex];

    if (question.questionType === 'multiple') {
      const newSelection = [...(currentSelection || [])];
      if (newSelection.includes(oIndex)) {
        setSelectedAnswers({ ...selectedAnswers, [qIndex]: newSelection.filter(ans => ans !== oIndex) });
      } else {
        setSelectedAnswers({ ...selectedAnswers, [qIndex]: [...newSelection, oIndex] });
      }
    } else {
      setSelectedAnswers({ ...selectedAnswers, [qIndex]: oIndex });
    }
  };

  const handleSubmitQuiz = async () => {
    // Check if every question has been answered
    const allAnswered = quiz.questions.every((q, index) => {
      const answer = selectedAnswers[index];
      return q.questionType === 'multiple' ? answer?.length > 0 : answer !== undefined;
    });

    if (!allAnswered) {
      return toast.error("Please answer all questions before submitting.");
    }

    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      const userAnswer = selectedAnswers[index];
      if (q.questionType === 'multiple') {
        if (arraysAreEqual(userAnswer, q.correctAnswers)) {
          correctCount++;
        }
      } else {
        if (userAnswer === q.correctAnswer) {
          correctCount++;
        }
      }
    });

    const finalScore = (correctCount / quiz.questions.length) * 100;
    setScore(finalScore);

    try {
      await addDoc(collection(db, "quizzes", quizId, "results"), { name: takerName, score: finalScore, submittedAt: new Date() });
    } catch (error) { toast.error("There was an issue submitting your score."); }
    setQuizFinished(true);
  };

  if (quizError) {
    return (
      <div className="min-h-screen neon-bg flex items-center justify-center text-center p-4">
        <div className="neon-card-glass glow-on-hover-magenta">
          <h1 className="text-3xl font-bold font-display text-red-400">ACCESS DENIED</h1>
          <p className="text-gray-300 mt-4">{quizError}</p>
          <Link to="/" className="neon-button neon-button-primary font-display mt-8">Return to Base</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen neon-bg flex items-center justify-center"><p className="text-2xl font-display neon-text-main">Loading Transmission...</p></div>;
  if (!quiz) return <div className="min-h-screen neon-bg flex items-center justify-center"><p className="text-2xl font-display neon-text-sub">Signal Lost. Quiz Not Found.</p></div>;

  if (quizFinished) { /* ... (Your existing, styled quizFinished JSX) ... */ }
  if (!quizStarted) { /* ... (Your existing, styled quizStarted JSX) ... */ }

  return (
    <div className="neon-bg pt-24">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <div className="max-w-3xl mx-auto p-4 sm:p-8">
        <h1 className="text-4xl font-bold text-center mb-8 neon-text-main font-display">{quiz.title}</h1>
        <div className="space-y-8">
          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="neon-card-glass">
              <p className="text-xl font-semibold mb-4 text-cyan-200">
                <span className="font-bold mr-2 font-display">Q{qIndex + 1}:</span>{question.text}
              </p>
              <p className="text-sm text-gray-400 mb-4 font-display uppercase tracking-wider">
                {question.questionType === 'multiple' ? 'Select all that apply' : 'Select one answer'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {question.options.map((option, oIndex) => {
                  const isSelected = question.questionType === 'multiple'
                    ? (selectedAnswers[qIndex] || []).includes(oIndex)
                    : selectedAnswers[qIndex] === oIndex;
                  return (
                    <button key={oIndex} onClick={() => handleAnswerSelect(qIndex, oIndex)} className={`p-4 rounded-lg text-left transition duration-200 w-full ${isSelected ? 'bg-neon-cyan/20 ring-2 ring-neon-cyan' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button onClick={handleSubmitQuiz} className="neon-button neon-button-primary font-display text-lg">
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}