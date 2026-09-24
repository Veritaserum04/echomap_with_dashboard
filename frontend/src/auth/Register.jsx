import { useState } from "react";
import { User, Mail, Lock, Route } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "./AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch {
      setError("Unable to create account.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-5">

      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-6"
      >
        <div className="text-center">

          <div className="inline-flex p-4 rounded-2xl bg-cyan-500/20">
            <Route size={36} className="text-cyan-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mt-5">
            Create EchoMap Account
          </h1>

          <p className="text-slate-400 mt-2">
            Register your personal dashboard.
          </p>

        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 text-red-400 p-3 text-sm">
            {error}
          </div>
        )}

        <Input
          icon={<User size={18} className="text-slate-500" />}
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />

        <Input
          icon={<Mail size={18} className="text-slate-500" />}
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />

        <Input
          icon={<Lock size={18} className="text-slate-500" />}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
        />

        <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-3 rounded-xl font-semibold">
          Register
        </button>

        <p className="text-center text-slate-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

function Input({
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="flex items-center bg-slate-950 rounded-xl px-4 border border-slate-700">
      {icon}

      <input
        type={type}
        className="w-full bg-transparent px-3 py-3 outline-none text-white"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}