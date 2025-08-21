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
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

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
        toast.error("Failed to load the quiz.");
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
  
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedAnswers).length !== quiz.questions.length) {
      return toast.error("Please answer all questions before submitting.");
    }

    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) correctCount++;
    });
    const finalScore = (correctCount / quiz.questions.length) * 100;
    setScore(finalScore);

    try {
      const resultsRef = collection(db, "quizzes", quizId, "results");
      await addDoc(resultsRef, { name: takerName, score: finalScore, submittedAt: new Date() });
    } catch (error) {
      console.error("Error saving results:", error);
      toast.error("There was an issue submitting your score.");
    }
    setQuizFinished(true);
  };

  if (loading) return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center"><p>Loading Quiz...</p></div>;
  if (!quiz) return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center"><p>Quiz not found.</p></div>;

  if (quizFinished) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold">Quiz Complete!</h1>
        <p className="mt-2 text-lg text-gray-300">Thank you for taking the quiz, {takerName}.</p>
        <div className="mt-8 bg-gray-800 p-8 rounded-lg shadow-xl">
          <p className="text-xl text-gray-400">Your Score:</p>
          <p className="text-7xl font-bold text-green-400 mt-2">{score.toFixed(0)}%</p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
        <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
        <div className="w-full max-w-md text-center">
          <h1 className="text-4xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-gray-400 mb-8">Enter your name to begin the quiz.</p>
          <form onSubmit={handleStartQuiz}>
            <input type="text" value={takerName} onChange={(e) => setTakerName(e.target.value)} placeholder="Your Name" className="w-full bg-gray-700 text-white p-4 rounded-lg text-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition duration-300">Start Quiz</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">{quiz.title}</h1>
        <div className="space-y-8">
          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <p className="text-xl font-semibold mb-4"><span className="text-blue-400 mr-2">Question {qIndex + 1}:</span>{question.text}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {question.options.map((option, oIndex) => (
                  <button key={oIndex} onClick={() => handleAnswerSelect(qIndex, oIndex)} className={`p-4 rounded-lg text-left transition duration-200 w-full ${selectedAnswers[qIndex] === oIndex ? 'bg-blue-600 ring-2 ring-blue-300' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button onClick={handleSubmitQuiz} className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-12 rounded-lg text-xl transition duration-300 shadow-md">
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}