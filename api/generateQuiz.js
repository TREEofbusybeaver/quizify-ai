// api/generateQuiz.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Get API key from Vercel environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = `
      Based on the following text, generate a multiple-choice quiz with 5 questions.
      The response MUST be a valid JSON object. Do not include any text before or after the JSON object.
      The JSON object should have a single key "questions", which is an array of question objects.
      Each question object must have three keys: "text" (the question), "options" (an array of 4 strings), and "correctAnswer" (the 0-indexed integer of the correct option).

      Text: """${text}"""
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonResponse = response.text();
    
    // Clean the response to ensure it's pure JSON
    const cleanedJson = jsonResponse.match(/```json\n([\s\S]*?)\n```/)[1];
    const quizData = JSON.parse(cleanedJson);

    res.status(200).json(quizData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
}