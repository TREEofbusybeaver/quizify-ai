import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AIQuizGenerator({ onQuizGenerated, setLoading }) {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (text.trim().length < 100) {
      return toast.error("Please provide at least 100 characters of text.");
    }

    setIsGenerating(true);
    setLoading?.(true);

    try {
      const response = await fetch('/api/generateQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Something went wrong on the server.');
      }

      if (!data || !Array.isArray(data.questions)) {
        throw new Error('Invalid response from server.');
      }

      onQuizGenerated?.(data.questions);
      toast.success("Quiz generated! Review and edit it below.");
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setLoading?.(false);
    }
  };

  return (
    <div className="neon-card-glass glow-on-hover-cyan p-6 mb-8">
      <h2 className="text-2xl font-bold mb-2 neon-text-main font-display">
        ✨ Generate Quiz with AI
      </h2>
      <p className="text-cyan-200 mb-4">
        Paste a block of text and let AI create the quiz for you.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here... The more detailed the text, the better the quiz."
        className="w-full min-h-[150px] p-3 neon-input"
        disabled={isGenerating}
        aria-label="Source text for AI quiz generation"
      />

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full mt-4 neon-button neon-button-primary font-display disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        aria-busy={isGenerating}
      >
        {isGenerating ? 'GENERATING...' : 'GENERATE QUIZ'}
      </button>
    </div>
  );
}