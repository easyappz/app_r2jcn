import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/auth";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      nav("/login", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Ошибка регистрации";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card form" data-easytag="id1-react/src/components/Auth/Register.jsx">
      <h2 style={{ marginTop: 0 }}>Регистрация</h2>
      {error ? <div className="alert">{error}</div> : null}
      <form onSubmit={onSubmit} data-easytag="id2-react/src/components/Auth/Register.jsx">
        <div className="field">
          <label className="label" htmlFor="name">Имя</label>
          <input id="name" name="name" className="input" placeholder="Иван Иванов" value={form.name} onChange={onChange} required />
        </div>
        <div className="field">
          <label className="label" htmlFor="email">Почта</label>
          <input id="email" name="email" type="email" className="input" placeholder="name@example.com" value={form.email} onChange={onChange} required />
        </div>
        <div className="field">
          <label className="label" htmlFor="password">Пароль</label>
          <input id="password" name="password" type="password" className="input" placeholder="••••••••" value={form.password} onChange={onChange} required minLength={6} />
        </div>
        <button className="btn" type="submit" disabled={loading}>{loading ? "Создаём..." : "Зарегистрироваться"}</button>
      </form>
      <p style={{ marginTop: 12, color: "#6e6e73" }}>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </section>
  );
}
