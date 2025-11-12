import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginUser({ email: form.email.trim(), password: form.password });
      localStorage.setItem("token", data?.token || "");
      nav("/profile", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Ошибка авторизации";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card form" data-easytag="id1-react/src/components/Auth/Login.jsx">
      <h2 style={{ marginTop: 0 }}>Вход</h2>
      {error ? <div className="alert">{error}</div> : null}
      <form onSubmit={onSubmit} data-easytag="id2-react/src/components/Auth/Login.jsx">
        <div className="field">
          <label className="label" htmlFor="email">Почта</label>
          <input id="email" name="email" type="email" className="input" placeholder="name@example.com" value={form.email} onChange={onChange} required />
        </div>
        <div className="field">
          <label className="label" htmlFor="password">Пароль</label>
          <input id="password" name="password" type="password" className="input" placeholder="••••••••" value={form.password} onChange={onChange} required />
        </div>
        <button className="btn" type="submit" disabled={loading}>{loading ? "Входим..." : "Войти"}</button>
      </form>
      <p style={{ marginTop: 12, color: "#6e6e73" }}>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
    </section>
  );
}
