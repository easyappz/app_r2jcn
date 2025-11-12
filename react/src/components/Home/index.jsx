import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero" data-easytag="id1-react/src/components/Home/index.jsx">
      <h1>Минималистичный аккаунт</h1>
      <p>Зарегистрируйтесь, авторизуйтесь и управляйте своим профилем — просто и красиво.</p>
      <div style={{ marginTop: 16 }}>
        <Link className="btn" to="/register">Создать аккаунт</Link>
      </div>
    </section>
  );
}
