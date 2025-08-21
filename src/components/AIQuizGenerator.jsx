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
    setLoading(true);

    try {
      const response = await fetch('/api/generateQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong on the server.');
      }
      
      onQuizGenerated(data.questions);
      toast.success("Quiz generated! Review and edit it below.");

    } catch (error) {
      console.error("Failed to generate quiz:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-blue-500 rounded-lg p-6 mb-8 bg-gray-800/50">
      <h2 className="text-2xl font-bold mb-2 text-blue-300">✨ Generate Quiz with AI</h2>
      <p className="text-gray-400 mb-4">Paste a block of text and let AI create the quiz for you.</p>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here... The more detailed the text, the better the quiz."
        className="w-full min-h-[150px] p-3 bg-gray-700 text-gray-200 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        disabled={isGenerating}
      />
      
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 rounded-lg text-lg transition duration-300"
      >
        {isGenerating ? 'Generating...' : 'Generate Quiz'}
      </button>
    </div>
  );
}