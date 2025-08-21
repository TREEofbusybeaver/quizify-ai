// api/generateQuiz.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export default async function handler(req, res) {
  // Check for the API key at the very beginning
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error("GOOGLE_AI_API_KEY is not set on Vercel.");
    return res.status(500).json({ error: "Server configuration error: Missing API Key." });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    if (!text || text.trim().length < 50) {
      return res.status(400).json({ error: 'Text must be at least 50 characters long.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `Based on the following text, generate a multiple-choice quiz with 5 questions. The response MUST be a valid JSON object ONLY. Do not include any text, markdown formatting like \`\`\`json, or explanations before or after the JSON object. The JSON object should have a single key "questions", which is an array of question objects. Each object must have "text", "options" (an array of 4 strings), and "correctAnswer" (a 0-indexed integer). Text: """${text}"""`;

    console.log("Sending prompt to Google AI...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponseText = response.text();
    console.log("Received raw response from Google AI:", aiResponseText);

    // Try to find a JSON object within the raw response text
    const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("AI response did not contain a valid JSON structure.");
      throw new Error("The AI model returned a non-JSON response. Please try rephrasing your text.");
    }

    const jsonText = jsonMatch[0];
    const quizData = JSON.parse(jsonText);
    
    console.log("Successfully parsed JSON. Sending to client.");
    return res.status(200).json(quizData);

  } catch (error) {
    console.error("Error in generateQuiz function:", error);
    // Send back a more informative error message to the frontend
    return res.status(500).json({ error: error.message || "An unknown error occurred while generating the quiz." });
  }
}