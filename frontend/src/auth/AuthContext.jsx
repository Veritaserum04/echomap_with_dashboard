import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- Load logged-in user ----------------
  useEffect(() => {
    const token = localStorage.getItem("echomap_token");

    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("echomap_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ---------------- Login ----------------
  async function login(email, password) {
    const response = await axios.post(`${API}/login`, {
      email,
      password,
    });

    localStorage.setItem("echomap_token", response.data.access_token);

    const me = await axios.get(`${API}/me`, {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    });

    setUser(me.data);
    return me.data;
  }

  // ---------------- Register ----------------
  async function register(name, email, password) {
    await axios.post(`${API}/register`, {
      name,
      email,
      password,
    });

    return login(email, password);
  }

  // ---------------- Logout ----------------
  function logout() {
    localStorage.removeItem("echomap_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}