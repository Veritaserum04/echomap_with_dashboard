import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Route, Mail, Lock } from "lucide-react";

import { useAuth } from "./AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-5">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-6"
      >
        <div className="text-center">

          <div className="inline-flex p-4 rounded-2xl bg-cyan-500/20">
            <Route size={36} className="text-cyan-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mt-5">
            Welcome Back
          </h1>

          <p className="text-slate-400 mt-2">
            Login to your EchoMap dashboard.
          </p>

        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 text-red-400 p-3 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="text-slate-400 text-sm">Email</label>

          <div className="mt-2 flex items-center bg-slate-950 rounded-xl px-4 border border-slate-700">
            <Mail size={18} className="text-slate-500" />

            <input
              type="email"
              className="w-full bg-transparent px-3 py-3 outline-none text-white"
              placeholder="student@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-sm">Password</label>

          <div className="mt-2 flex items-center bg-slate-950 rounded-xl px-4 border border-slate-700">
            <Lock size={18} className="text-slate-500" />

            <input
              type="password"
              className="w-full bg-transparent px-3 py-3 outline-none text-white"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-3 rounded-xl font-semibold transition">
          Login
        </button>

        <p className="text-center text-slate-400 text-sm">
          Don't have an account?{" "}
          <Link className="text-cyan-400" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}