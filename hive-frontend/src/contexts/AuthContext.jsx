import { createContext, useContext, useState, useEffect } from 'react';
import { api, BASE_URL } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Decode JWT safely (if needed) or fetch user details.
  const fetchCurrentUser = async () => {
    // Currently, our APIs don't have a /users/me endpoint, 
    // so we need to rely on the token decode OR caching logic.
    // However, decoding the token gives the user_id. Let's do that.
    
    const token = localStorage.getItem('hive_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // The payload structure defined in backend security.py holds "user_id"
      const myId = payload.user_id || payload.sub;
      const userData = await api.get(`/users/${myId}`);
      setUser(userData);
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem('hive_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    // Call fetch directly since api.js binds the token natively which might cross-contaminate Login.
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    if (!res.ok) {
      throw new Error("Invalid login credentials");
    }

    const data = await res.json();
    localStorage.setItem('hive_token', data.access_token);
    await fetchCurrentUser();
    navigate('/');
  };

  const register = async (formData) => {
    // formData contains Name, Email, Username, Password, Bio, File
    const res = await fetch(`${BASE_URL}/users/`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }
    
    // Auto login after successful register
    const email = formData.get('email');
    const password = formData.get('password');
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('hive_token');
    setUser(null);
    navigate('/auth', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-page-bg">
           <p className="text-text-muted animate-pulse font-heading">Loading Hive...</p>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
