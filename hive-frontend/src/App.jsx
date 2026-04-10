import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage/AuthPage'
import MainLayout from './components/layout/MainLayout'
import FeedPage from './pages/FeedPage/FeedPage'
import PlaceholderPage from './pages/PlaceholderPage'
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
        <Route path="chat" element={<PlaceholderPage title="Chats" />} />
        <Route path="explore" element={<PlaceholderPage title="Explore" />} />
        
        {/* Profile Routes */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/:id" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App
