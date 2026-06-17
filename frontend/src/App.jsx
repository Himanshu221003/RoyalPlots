import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ComparisonProvider } from './context/ComparisonContext'
import { SocketProvider } from './context/SocketContext'
import PrivateRoute from './components/PrivateRoute'
import SplashScreen from './pages/SplashScreen'
import LoginSignup from './pages/LoginSignup'
import HomeScreen from './pages/HomeScreen'
import UserDashboard from './pages/UserDashboard'
import AddProperty from './pages/AddProperty'
import Property from './pages/Property'
import PropertyProfile from './pages/PropertyProfile'
import Favorites from './pages/Favorites'
import Inquiry from './pages/Inquiry'
import Admin from './pages/Admin'
import About from './pages/About'
import Agents from './pages/Agents'
import AgentProfile from './pages/AgentProfile'
import Contact from './pages/Contact'
import Comparison from './pages/Comparison'
import Chatbot from './components/Chatbot'

import { GoogleOAuthProvider } from '@react-oauth/google'

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID_PLACEHOLDER";

  return (
    <ThemeProvider>
      <ComparisonProvider>
        <SocketProvider>
          <AuthProvider>
            <GoogleOAuthProvider clientId={googleClientId}>
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<SplashScreen />} />
                  <Route path="/login" element={<LoginSignup />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/agents" element={<Agents />} />
                  <Route path="/agent/:id" element={<AgentProfile />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/compare" element={<Comparison />} />

                  {/* Protected routes — require valid JWT */}
                  <Route path="/home" element={<PrivateRoute><HomeScreen /></PrivateRoute>} />
                  <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
                  <Route path="/add-property" element={<PrivateRoute><AddProperty /></PrivateRoute>} />
                  <Route path="/properties" element={<PrivateRoute><Property /></PrivateRoute>} />
                  <Route path="/property/:id" element={<PrivateRoute><PropertyProfile /></PrivateRoute>} />
                  <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
                  <Route path="/inquiries" element={<PrivateRoute><Inquiry /></PrivateRoute>} />
                  <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
                </Routes>
                <Chatbot />
              </BrowserRouter>
            </GoogleOAuthProvider>
          </AuthProvider>
        </SocketProvider>
      </ComparisonProvider>
    </ThemeProvider>
  )
}
