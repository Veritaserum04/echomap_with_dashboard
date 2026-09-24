import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("echomapUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("echomapUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("echomapUser");
    }
  }, [user]);

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem("echomapUsers") || "[]");

    const exists = users.find((u) => u.email === email);

    if (exists) {
      return false;
    }

    const newUser = { name, email, password };

    users.push(newUser);
    localStorage.setItem("echomapUsers", JSON.stringify(users));

    return true;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("echomapUsers") || "[]");

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) return false;

    setUser(foundUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);