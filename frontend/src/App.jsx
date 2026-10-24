import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LegalPage from './pages/LegalPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/privacy" element={<LegalPage type="privacy" />} />
              <Route path="/terms" element={<LegalPage type="terms" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
