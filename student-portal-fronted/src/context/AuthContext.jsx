import { createContext, useContext, useState, useEffect } from 'react';
import { getMyProfile } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem('access_token'));
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    // Decode JWT payload to get email (without verifying sig)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ email: payload.sub || 'student' });
    } catch {
      setUser({ email: 'student' });
    }

    setLoading(false);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setUser({ email: payload.sub || 'student' });
    } catch {
      setUser({ email: 'student' });
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
