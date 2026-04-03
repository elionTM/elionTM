import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const AuthContext = createContext({ user: null, loading: true, login: () => {}, signup: () => {}, logout: () => {}, updateUser: () => {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
        const data = await response.json();
        if (data.status === 'success') {
          setUser(data.data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    const data = await response.json();
    if (data.status === 'success') {
      setUser(data.data.user);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const signup = async (name, email, password) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include'
    });
    const data = await response.json();
    if (data.status === 'success') {
      setUser(data.data.user);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { credentials: 'include' });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading application...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
