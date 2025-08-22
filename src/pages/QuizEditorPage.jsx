// src/pages/QuizEditorPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import AIQuizGenerator from '../components/AIQuizGenerator';

// Template for a new question, including questionType
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
    updatedQuestions[qIndex].correctAnswer = type === 'single' ? 0 : [];
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[qIndex];
    if (question.questionType === 'single') {
      question.correctAnswer = oIndex;
    } else {
      const currentAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
      if (currentAnswers.includes(oIndex)) {
        question.correctAnswer = currentAnswers.filter(ans => ans !== oIndex);
      } else {
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
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  const handleSaveQuiz = async () => {
    if (!title.trim()) return toast.error("Please enter a quiz title.");
    for (const [index, q] of questions.entries()) {
      if (!q.text.trim() || q.options.some(opt => !opt.trim())) {
        return toast.error(`Please fill all question and option fields for Question ${index + 1}.`);
      }
      if (q.questionType === 'multiple' && q.correctAnswer.length === 0) {
        return toast.error(`Please select at least one correct answer for Question ${index + 1}.`);
      }
    }
    setLoading(true);
    try {
      const questionsForFirestore = questions.map(q => ({
        text: q.text,
        options: q.options,
        questionType: q.questionType,
        ...(q.questionType === 'multiple' 
          ? { correctAnswers: q.correctAnswer.sort() } 
          : { correctAnswer: q.correctAnswer })
      }));
      await addDoc(collection(db, "quizzes"), {
        creatorId: currentUser.uid,
        title,
        questions: questionsForFirestore,
        createdAt: new Date(),
        isActive: true
      });
      toast.success("Quiz saved successfully!");
      navigate('/dashboard');
    } catch (error) {
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
    <div className="neon-bg pt-24">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <h1 className="text-5xl font-bold text-center mb-10 neon-text-main font-display">
          Quiz Editor
        </h1>
        
        <div className="mb-8">
          <AIQuizGenerator onQuizGenerated={handleAIQuizGenerated} setLoading={setLoading} />
        </div>

        <div className="neon-card-glass glow-on-hover-cyan mb-8">
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

              <div className="my-6">
                <span className="font-semibold text-gray-300 mr-4 font-display text-lg">Type:</span>
                <div className="inline-flex rounded-lg shadow-md">
                  <button onClick={() => handleQuestionTypeChange(qIndex, 'single')} className={`neon-button neon-button-sm font-display rounded-r-none ${question.questionType === 'single' ? 'bg-neon-cyan/20' : 'bg-transparent'}`}>
                    Single Answer
                  </button>
                  <button onClick={() => handleQuestionTypeChange(qIndex, 'multiple')} className={`neon-button neon-button-sm font-display rounded-l-none border-l-0 ${question.questionType === 'multiple' ? 'bg-neon-cyan/20' : 'bg-transparent'}`}>
                    Multiple Answers
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-300 font-display text-lg">Options:</h4>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-4">
                    <input 
                      type={question.questionType === 'single' ? 'radio' : 'checkbox'} 
                      name={`correct-answer-${qIndex}`} 
                      checked={question.questionType === 'single' ? question.correctAnswer === oIndex : (Array.isArray(question.correctAnswer) && question.correctAnswer.includes(oIndex))}
                      onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                    />
                    <input 
                      type="text" 
                      value={option} 
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} 
                      placeholder={`Option ${oIndex + 1}`} 
                      className="w-full p-2 neon-input" 
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-10">
          <button
            onClick={addQuestion}
            className="font-display uppercase tracking-wider text-neon-magenta border-2 border-neon-magenta rounded-md py-2 px-5 transition-all duration-300 hover:bg-neon-magenta/10 glow-on-hover-magenta disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add Question
          </button>
          <button onClick={handleSaveQuiz} disabled={loading} className="neon-button neon-button-primary font-display text-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'SAVING...' : 'SAVE QUIZ'}
          </button>
        </div>
      </div>
    </div>
  );
}