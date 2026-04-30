import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mock API call - replace with actual API
      const mockUser = {
        id: '1',
        email: email,
        name: email === 'admin@kyc.com' ? 'Admin User' : 'Organization User',
        role: email === 'admin@kyc.com' ? 'admin' : 'organization',
        organizationId: 'org_123',
        organization: {
          name: 'Demo Corporation',
          plan: 'pro',
          apiKey: 'sk_test_' + Math.random().toString(36).substring(7)
        }
      };

      const mockToken = 'jwt_' + Math.random().toString(36).substring(7);
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userData', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Mock registration
      const newUser = {
        id: Math.random().toString(36).substring(7),
        email: userData.email,
        name: userData.name,
        role: 'organization',
        organizationId: 'org_' + Math.random().toString(36).substring(7),
        organization: {
          name: userData.organizationName,
          plan: 'free',
          apiKey: 'sk_test_' + Math.random().toString(36).substring(7)
        }
      };

      const mockToken = 'jwt_' + Math.random().toString(36).substring(7);
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userData', JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isOrganization: user?.role === 'organization'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
