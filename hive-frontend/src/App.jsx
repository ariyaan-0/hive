import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage/AuthPage'
import MainLayout from './components/layout/MainLayout'
import FeedPage from './pages/FeedPage/FeedPage'
import ExplorePage from './pages/ExplorePage/ExplorePage'
import ChatPage from './pages/ChatPage/ChatPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import { useAuth } from './contexts/AuthContext'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Routes>
      {/* Auth Route */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Main Layout Routes (Protected) */}
      <Route path="/" element={
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      }>
        <Route index element={<FeedPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="explore" element={<ExplorePage />} />
        
        {/* Profile Routes */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/:id" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App
