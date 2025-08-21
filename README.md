# Quizify AI

Quizify AI is a modern web application that lets users create, share, and automatically generate multiple-choice quizzes using the Google Gemini API. The project uses a React frontend, Firebase for backend services, and is deployable on Vercel.

Live demo: (add your Vercel URL here after deployment)

---

## ✨ Key Features

- User authentication: secure sign-up and login for users to manage their quizzes.
- Manual quiz creation: an intuitive quiz editor to create custom quizzes with single or multiple correct answers.
- AI-powered generation: paste any block of text and use the Gemini API to automatically generate a relevant, structured quiz in seconds.
- Effortless sharing: every saved quiz generates a unique, shareable link.
- Anonymous quiz taking: anyone with a link can take a quiz without an account.
- Instant results: quiz takers see their scores immediately after submission.
- Creator dashboard: a dashboard for quiz creators to view their quizzes and see detailed results, including who took each quiz and their scores.

---

## 🛠️ Tech Stack

- Frontend: React, Vite
- Styling: Tailwind CSS
- Backend services:
  - Firebase Authentication (user management)
  - Firestore (quiz data and results)
- AI model: Google Gemini API
- Deployment: Vercel (serverless functions for the AI backend)

---

## 🚀 Getting Started

To run this project locally, follow these steps.

### 1) Clone the repository
    git clone https://github.com/your-username/quizify-ai.git
    cd quizify-ai

### 2) Install dependencies
    npm install

### 3) Set up environment variables
Create a file named .env.local in the project root and add the following keys. (Do not commit this file.)

Example (.env.local):

    # Firebase (frontend)
    VITE_API_KEY=YOUR_FIREBASE_API_KEY
    VITE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
    VITE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
    VITE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
    VITE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
    VITE_APP_ID=YOUR_FIREBASE_APP_ID

    # Google AI (backend)
    GOOGLE_AI_API_KEY=YOUR_GOOGLE_AI_API_KEY

### 4) Run the development server
    npm run dev

The app will be available at http://localhost:5173

---

## 🌐 Deployment (Vercel)

- The app is configured for continuous deployment on Vercel.
- Each push to the main branch can trigger a new build and deployment.
- The serverless function for AI quiz generation lives in the /api directory and is deployed automatically by Vercel.

---

## ✅ Ready for GitHub

After fixing any file names and adding this README.md, you can initialize and push the project:

    git init
    git add .
    git commit -m "Initial commit: Quizify AI"
    git branch -M main
    git remote add origin <your_repo_url>
    git push -u origin main

---

## 📄 License

Add a license of your choice (e.g., MIT, Apache-2.0) at the root of the repository as LICENSE.
