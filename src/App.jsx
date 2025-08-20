// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // We will create this
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import QuizEditorPage from './pages/QuizEditorPage';
import TakeQuizPage from './pages/TakeQuizPage';
import NotFoundPage from './pages/NotFoundPage';

// ... import other pages

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/quiz/:quizId" element={<TakeQuizPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/editor/:quizId" element={ /* For editing existing */
              <ProtectedRoute>
                <QuizEditorPage />
              </ProtectedRoute>
            }
          />
          <Route path="/editor" element={ /* For creating new */
              <ProtectedRoute>
                <QuizEditorPage />
              </ProtectedRoute>
            }
          />  
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
export default App;