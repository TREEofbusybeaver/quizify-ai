// src/pages/QuizEditorPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';

const newQuestionTemplate = {
  text: '',
  options: ['', '', '', ''],
  correctAnswer: 0 // Index of the correct option
};

export default function QuizEditorPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([newQuestionTemplate]);
  const [loading, setLoading] = useState(false);

  // --- State Update Handlers ---

  const handleQuestionTextChange = (index, newText) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = newText;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, newText) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = newText;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, newCorrectIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctAnswer = parseInt(newCorrectIndex, 10);
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { ...newQuestionTemplate, options: [...newQuestionTemplate.options] }]);
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) {
      toast.error("A quiz must have at least one question.");
      return;
    }
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };
  
  // --- Form Submission ---

  const handleSaveQuiz = async () => {
    // Basic validation
    if (!title.trim()) {
      return toast.error("Please enter a quiz title.");
    }
    for (const q of questions) {
      if (!q.text.trim()) return toast.error("All question fields must be filled.");
      if (q.options.some(opt => !opt.trim())) return toast.error("All option fields must be filled.");
    }

    setLoading(true);
    try {
      // Create the quiz document in Firestore
      await addDoc(collection(db, "quizzes"), {
        creatorId: currentUser.uid,
        title: title,
        questions: questions,
        createdAt: new Date()
      });
      toast.success("Quiz saved successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving quiz: ", error);
      toast.error("Failed to save quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <Toaster position="top-center" />
      <h1 style={{ textAlign: 'center' }}>Quiz Editor</h1>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="quizTitle" style={{ fontSize: '1.2rem' }}>Quiz Title</label>
        <input
          type="text"
          id="quizTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., General Knowledge Challenge"
          style={{ width: '100%', padding: '10px', fontSize: '1.1rem', marginTop: '0.5rem' }}
        />
      </div>

      {questions.map((question, qIndex) => (
        <div key={qIndex} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ marginTop: 0 }}>Question {qIndex + 1}</h3>
            <button onClick={() => removeQuestion(qIndex)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>
              Remove
            </button>
          </div>
          <textarea
            value={question.text}
            onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
            placeholder={`Enter text for question ${qIndex + 1}`}
            style={{ width: '100%', minHeight: '80px', padding: '8px' }}
          />
          <h4 style={{ marginBottom: '0.5rem' }}>Options</h4>
          {question.options.map((option, oIndex) => (
            <div key={oIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input 
                type="radio" 
                name={`correct-answer-${qIndex}`} 
                checked={question.correctAnswer === oIndex}
                onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                style={{ marginRight: '10px' }}
              />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                placeholder={`Option ${oIndex + 1}`}
                style={{ flexGrow: 1, padding: '8px' }}
              />
            </div>
          ))}
        </div>
      ))}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        <button onClick={addQuestion} style={{ padding: '10px 15px', background: '#007bff' }}>+ Add Question</button>
        <button onClick={handleSaveQuiz} disabled={loading} style={{ padding: '10px 20px', background: '#28a745', fontSize: '1.1rem' }}>
          {loading ? 'Saving...' : 'Save Quiz'}
        </button>
      </div>
    </div>
  );
}