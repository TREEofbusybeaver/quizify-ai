# 🔱 Quizify AI

### Create • Share • Challenge • Dominate

Quizify AI is a full-stack web application designed to bring quiz creation into the modern era. It combines a sleek, retro-futuristic user interface with the power of Google's Gemini API, allowing users to not only craft quizzes manually but also generate them instantly from any block of text.

---

<img width="1887" height="959" alt="QUIZIFY AI Home" src="https://github.com/user-attachments/assets/f7d0791f-f9d7-402b-9d4c-06102f224f66" />

<img width="1884" height="982" alt="QUIZIFY AI Dashboard" src="https://github.com/user-attachments/assets/801184c6-d97c-4ceb-94f4-149d3ad5ccda" />

---

### 🔗 Live Application

**Test the deployed application here:** **[https://quizify-ai-orpin.vercel.app/]**

---

## ✨ Core Features

This project successfully implements all the core requirements and the bonus challenge, resulting in a feature-rich platform.

#### 🧑‍💻 Creator-Focused Features
-   **Secure User Accounts:** Full authentication powered by Firebase for creating and managing a personal quiz library.
-   **Intuitive Quiz Editor:** A dynamic interface to add, edit, and remove questions on the fly.
-   **Advanced Question Types:** Supports both traditional **single-answer** and complex **multiple-answer** questions.
-   **🧠 AI-Powered Generation:** A "Bonus Challenge" feature that integrates Google's Gemini API. Paste any text to automatically generate a relevant, structured quiz.
-   **Comprehensive Dashboard:** A split-screen dashboard to view all created quizzes and their detailed results in one place.
-   **Quiz Lifecycle Management:** Creators can **End** a live quiz to make its link inaccessible and **Reactivate** it later, giving them full control over submissions.

#### 🌐 Taker-Focused Features
-   **Effortless Access:** Anyone with a link can take a quiz without an account after providing their name.
-   **Modern Quiz Experience:** A single, scrolling page displays all questions for a smooth, user-friendly flow.
-   **Instant Feedback:** Scores are calculated and displayed immediately upon submission.
-   **Responsive Design:** The application is fully responsive, providing a seamless experience on both desktop and mobile devices.

---

## 🛠️ Tech Stack & Architecture

| Category      | Technology / Service                               | Purpose                                                              |
| :------------ | :------------------------------------------------- | :------------------------------------------------------------------- |
| **Frontend**  | React (with Vite), React Router                    | Building a fast, modern single-page application and handling routing.    |
| **Styling**   | Tailwind CSS                                       | For a utility-first, highly customizable "80s Neon + Frutiger Aero" theme. |
| **Backend**   | Firebase Auth & Firestore                          | Secure user authentication and real-time NoSQL database for data storage. |
| **AI**        | Google Gemini API                                  | Powering the automatic quiz generation from text.                        |
| **Deployment**| Vercel                                             | Continuous deployment (CI/CD) with serverless functions for the AI backend. |

---

## 🚀 Getting Started Locally

To set up and run this project on your local machine, follow these steps.

### 1. Prerequisites
-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [Git](https://git-scm.com/)
-   An active [Firebase](https://firebase.google.com/) project
-   A [Google AI Studio](https://aistudio.google.com/) API key

### 2. Clone the Repository
```bash
git clone [YOUR GITHUB REPOSITORY URL]
cd [YOUR PROJECT FOLDER NAME]
```

### 3. Install Dependencies
This project uses npm as its package manager.
```bash
npm install
```

### 4. Configure Environment Variables
This is the most crucial step. The application requires API keys to connect to Firebase and the Google AI service.
- Create a file named `.env.local` in the root of your project.
- Copy the contents of the `.env.example` below and paste it into your new file.
- Replace the placeholder values with your actual keys.

#### .env.example
```
# --- Keys for Firebase (Frontend) - Found in your Firebase project settings ---
VITE_API_KEY="YOUR_FIREBASE_API_KEY"
VITE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
VITE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
VITE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
VITE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
VITE_APP_ID="YOUR_FIREBASE_APP_ID"

# --- Key for Google AI (Backend) - From Google AI Studio ---
GOOGLE_AI_API_KEY="YOUR_GOOGLE_AI_API_KEY"

# --- Key for Deployment (Frontend) - Your main Vercel URL ---
VITE_PUBLIC_URL="http://localhost:5173"
```

### 5. Run the Development Server
```bash
npm run dev
```
The application will be running at http://localhost:5173.

## 🌐 Deployment to Vercel

This project is optimized for Vercel.

1. **Push to GitHub:** Push your complete project to a public GitHub repository.
2. **Import Project:** On your Vercel dashboard, import the project from your GitHub repository. Vercel will automatically detect that it is a Vite project.
3. **Configure Environment Variables:** In your Vercel project's Settings -> Environment Variables, add all the same keys from your `.env.local` file. Crucially, update `VITE_PUBLIC_URL` to your production Vercel domain (e.g., `https://quizify-ai-orpin.vercel.app`).
4. **Deploy:** Vercel will build and deploy your application. The serverless function in the `/api` directory will be deployed automatically.

The `vercel.json` file is included in this repository to handle client-side routing, ensuring direct links to quizzes (`/quiz/:id`) work correctly on the live site.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.
