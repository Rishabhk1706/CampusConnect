import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import LegalPage from './pages/LegalPage'
import AboutPage from './pages/AboutPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import StudentDirectoryPage from './pages/StudentDirectoryPage'
import StudentProfilePage from './pages/StudentProfilePage'

console.log("--> App.jsx loaded! Current URL:", window.location.href);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  )
}

function AppShell() {
  const location = useLocation()
  const isStudentArea = location.pathname.startsWith('/directory') || location.pathname.startsWith('/students/')
  return (
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path='/login' element={<LoginPage/>} />
              <Route path='/register' element={<RegisterPage/>} />
              <Route path='/forgot-password' element={<ForgotPasswordPage/>} />
              <Route path="/directory" element={<Navigate to="/directory/peers" replace />} />
              <Route path="/directory/:relation" element={<ProtectedRoute><StudentDirectoryPage /></ProtectedRoute>} />
              <Route path="/students/:id" element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>} />
              <Route path="/privacy" element={<LegalPage type="privacy" />} />
              <Route path="/terms" element={<LegalPage type="terms" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          {!isStudentArea && <Footer />}
        </div>
  )
}

function ProtectedRoute({ children }) {
  const { authStatus, validateSession } = useAuth()
  const location = useLocation()

  if (authStatus === 'checking') {
    return <main className="flex min-h-[50vh] items-center justify-center px-4 text-sm text-slate-500">Checking your session…</main>
  }

  if (authStatus === 'error') {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="font-semibold text-slate-800">We could not verify your session.</p>
          <p className="mt-2 text-sm text-slate-500">Check your connection and try again.</p>
          <button type="button" onClick={validateSession} className="mt-4 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Retry
          </button>
        </div>
      </main>
    )
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
