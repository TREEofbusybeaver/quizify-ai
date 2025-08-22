// src/pages/QuizEditorPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import AIQuizGenerator from '../components/AIQuizGenerator';

const newQuestionTemplate = { 
  text: '', 
  options: ['', '', '', ''], 
  questionType: 'single',
  correctAnswer: 0
};

export default function QuizEditorPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ ...newQuestionTemplate, options: [...newQuestionTemplate.options] }]);
  const [loading, setLoading] = useState(false);

  // --- Handlers for Form Changes ---
  const handleQuestionTextChange = (qIndex, newText) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].text = newText;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, newText) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = newText;
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (qIndex, type) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].questionType = type;
    // When switching types, reset the answer to the correct format
    updatedQuestions[qIndex].correctAnswer = type === 'single' ? 0 : [];
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[qIndex];

    if (question.questionType === 'single') {
      question.correctAnswer = oIndex;
    } else { // It's 'multiple'
      const currentAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
      if (currentAnswers.includes(oIndex)) {
        // If already selected, remove it
        question.correctAnswer = currentAnswers.filter(ans => ans !== oIndex);
      } else {
        // If not selected, add it
        question.correctAnswer = [...currentAnswers, oIndex];
      }
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { ...newQuestionTemplate, options: [...newQuestionTemplate.options] }]);
  };

  const removeQuestion = (qIndex) => {
    if (questions.length <= 1) return toast.error("A quiz must have at least one question.");
    const updatedQuestions = questions.filter((_, i) => i !== qIndex);
    setQuestions(updatedQuestions);
  };

  const handleSaveQuiz = async () => {
    if (!title.trim()) return toast.error("Please enter a quiz title.");
    for (const q of questions) {
      if (!q.text.trim() || q.options.some(opt => !opt.trim())) {
        return toast.error("All question and option fields must be filled.");
      }
      if (q.questionType === 'multiple' && (!Array.isArray(q.correctAnswer) || q.correctAnswer.length === 0)) {
        return toast.error(`Please select at least one correct answer for Question ${questions.indexOf(q) + 1}.`);
      }
    }
    setLoading(true);
    try {
      const questionsForFirestore = questions.map(q => {
        if (q.questionType === 'multiple') {
          return {
            text: q.text,
            options: q.options,
            questionType: 'multiple',
            correctAnswers: Array.isArray(q.correctAnswer) ? q.correctAnswer.sort() : []
          };
        }
        return {
          text: q.text,
          options: q.options,
          questionType: 'single',
          correctAnswer: q.correctAnswer
        };
      });

      await addDoc(collection(db, "quizzes"), {
        creatorId: currentUser.uid,
        title: title,
        questions: questionsForFirestore,
        createdAt: new Date(),
        isActive: true
      });
      toast.success("Quiz saved successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving quiz: ", error);
      toast.error("Failed to save quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleAIQuizGenerated = (generatedQuestions) => {
    if (Array.isArray(generatedQuestions) && generatedQuestions.length > 0) {
      const questionsWithTypes = generatedQuestions.map(q => ({...q, questionType: 'single'}));
      setTitle("AI Generated Quiz");
      setQuestions(questionsWithTypes);
    } else {
      toast.error("AI failed to generate a valid quiz.");
    }
  };

  return (
    <div className="neon-bg pt-24 min-h-screen">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />

      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <h1 className="text-5xl font-bold text-center mb-10 neon-text-main font-display filter drop-shadow-glow-cyan">
          Quiz Editor
        </h1>
        
        {/* AI Generator Section */}
        <div className="neon-card-glass mb-8 glow-on-hover-cyan">
          <AIQuizGenerator onQuizGenerated={handleAIQuizGenerated} setLoading={setLoading} />
        </div>

        {/* Quiz Title Section */}
        <div className="neon-card-glass mb-8 glow-on-hover-cyan">
          <label htmlFor="quizTitle" className="text-xl font-bold text-cyan-300 font-display">Quiz Title</label>
          <input 
            type="text" 
            id="quizTitle" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g., The Ultimate Sci-Fi Challenge" 
            className="w-full mt-4 p-3 neon-input" 
          />
        </div>

        {/* Questions Section */}
        <div className="space-y-8">
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="neon-card-glass glow-on-hover-cyan">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-cyan-200 font-display">Question {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <button onClick={() => removeQuestion(qIndex)} className="text-red-400 hover:text-red-300 font-bold text-sm uppercase font-display tracking-wider">
                    &times; Remove
                  </button>
                )}
              </div>
              
              <textarea 
                value={question.text} 
                onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)} 
                placeholder={`Enter question text...`} 
                className="w-full min-h-[100px] p-3 neon-input" 
              />

              <div className="my-4">
                <span className="font-semibold text-gray-300 mr-4">Question Type:</span>
                <div className="inline-flex rounded-md shadow-sm">
                  <button onClick={() => handleQuestionTypeChange(qIndex, 'single')} className={`px-4 py-2 rounded-l-lg border border-gray-600 transition-colors ${question.questionType === 'single' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    Single Answer
                  </button>
                  <button onClick={() => handleQuestionTypeChange(qIndex, 'multiple')} className={`px-4 py-2 rounded-r-lg border border-gray-600 transition-colors ${question.questionType === 'multiple' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    Multiple Answers
                  </button>
                </div>
              </div>

              <h4 className="mt-4 mb-2 font-semibold text-gray-300">Options (Select the correct one/s)</h4>
              <div className="space-y-3">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3">
                    <input 
                      type={question.questionType === 'single' ? 'radio' : 'checkbox'} 
                      name={`correct-answer-${qIndex}`} 
                      checked={
                        question.questionType === 'single' 
                          ? question.correctAnswer === oIndex 
                          : (Array.isArray(question.correctAnswer) && question.correctAnswer.includes(oIndex))
                      }
                      onChange={() => handleCorrectAnswerChange(qIndex, oIndex)} 
                      className="w-5 h-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" 
                    />
                    <input 
                      type="text" 
                      value={option} 
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} 
                      placeholder={`Option ${oIndex + 1}`} 
                      className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-8">
          <button onClick={addQuestion} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
            + Add Question
          </button>
          <button onClick={handleSaveQuiz} disabled={loading} className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
            {loading ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}