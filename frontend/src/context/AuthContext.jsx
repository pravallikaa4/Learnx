import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ New: Added updateUser to allow components to manually refresh user state
  const updateUser = (userData) => {
    setCurrentUser(userData);
  };

  const loadUser = async () => {
    try {
      const user = await apiRequest("/api/auth/me", "GET");
      setCurrentUser(user);
    } catch (err) {
      console.log("User load failed");
      localStorage.removeItem("token");
      setCurrentUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadUser();
    } else {
      setLoadingUser(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await apiRequest("/api/auth/login", "POST", { email, password });
    localStorage.setItem("token", res.token);
    await loadUser();
  };

  const register = async (data) => {
    const res = await apiRequest("/api/auth/register", "POST", data);
    localStorage.setItem("token", res.token);
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      // ✅ Added updateUser to the value object below
      value={{ currentUser, login, register, logout, loadingUser, updateUser }}
    >
      {!loadingUser && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
