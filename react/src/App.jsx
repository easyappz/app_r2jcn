import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { Home } from "./components/Home";
import Register from "./components/Auth/Register.jsx";
import Login from "./components/Auth/Login.jsx";
import Profile from "./components/Profile/index.jsx";
import NotFound from "./components/NotFound/index.jsx";
import "./App.css";

function ProtectedRoute({ children }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div data-easytag="id1-react/src/App.jsx" className="app-shell">
      <header className="topbar">
        <div className="container">
          <Link to="/" className="brand" data-easytag="id2-react/src/App.jsx">SimpleApple</Link>
          <nav className="nav" data-easytag="id3-react/src/App.jsx">
            <Link to="/" className="nav-link">Главная</Link>
            <Link to="/profile" className="nav-link">Профиль</Link>
            <Link to="/login" className="nav-link">Войти</Link>
            <Link to="/register" className="nav-link">Регистрация</Link>
          </nav>
        </div>
      </header>
      <main className="container main" data-easytag="id4-react/src/App.jsx">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer" data-easytag="id5-react/src/App.jsx">© {new Date().getFullYear()} SimpleApple</footer>
    </div>
  );
}
