import { createContext, useContext, useState, useEffect } from "react";
import { getToken, getUser, saveToken, saveUser, logout as doLogout } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(false);

  const login = (userData, userToken) => {
    saveToken(userToken);
    saveUser(userData);
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    doLogout();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isPro = user?.plan === "pro" || user?.plan === "team";

  return (
    <AuthContext.Provider value={{ user, token, loading, setLoading, login, logout, isAuthenticated, isPro }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);