// src/components/AIQuizGenerator.jsx

import { useState } from 'react';
import toast from 'react-hot-toast';

// This component expects a function called `onQuizGenerated` to be passed in as a prop.
// This is how we will send the generated quiz data back up to the QuizEditorPage.
export default function AIQuizGenerator({ onQuizGenerated, setLoading }) {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (text.trim().length < 100) { // Simple validation
      return toast.error("Please provide at least 100 characters of text to generate a meaningful quiz.");
    }

    setIsGenerating(true);
    setLoading(true); // Notify the parent component that a process is running

    try {
      const response = await fetch('/api/generateQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        // If the server responds with an error, try to parse it and show it
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong on the server.');
      }

      const data = await response.json();
      
      // Call the function passed in via props, sending the AI's response data
      onQuizGenerated(data.questions);
      toast.success("Quiz generated! You can now review and edit it below.");

    } catch (error) {
      console.error("Failed to generate quiz:", error);
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
      setLoading(false); // Always notify the parent to stop the loading state
    }
  };

  return (
    <div style={{ border: '2px dashed #007bff', borderRadius: '8px', padding: '1rem', marginBottom: '2rem' }}>
      <h2 style={{ marginTop: 0, color: '#007bff' }}>✨ Generate Quiz with AI</h2>
      <p>Paste a block of text (like an article or lecture notes) and let AI create the quiz for you.</p>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here... The more detailed the text, the better the quiz."
        style={{
          width: '100%',
          minHeight: '150px',
          padding: '8px',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
        disabled={isGenerating}
      />
      
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '1.1rem',
          marginTop: '1rem',
          backgroundColor: isGenerating ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isGenerating ? 'Generating...' : 'Generate Quiz'}
      </button>
    </div>
  );
}