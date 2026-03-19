import { createContext, useContext, useState, useEffect } from "react";
import { adminLogin } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const info = localStorage.getItem("adminInfo");
    if (token && info) {
      setIsAdmin(true);
      setAdminInfo(JSON.parse(info));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await adminLogin({ username, password });
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminInfo", JSON.stringify(data.admin));
    setIsAdmin(true);
    setAdminInfo(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    setIsAdmin(false);
    setAdminInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, adminInfo, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
