import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('medischedule_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (authResponse) => {
    setUser(authResponse);
    sessionStorage.setItem('medischedule_user', JSON.stringify(authResponse));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('medischedule_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
