import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, changePassword } from "../../api/profile";

export default function Profile() {
  const nav = useNavigate();
  const [profile, setProfile] = useState({ id: null, name: "", email: "" });
  const [pfMsg, setPfMsg] = useState("");
  const [pfErr, setPfErr] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [pwdForm, setPwdForm] = useState({ current_password: "", new_password: "" });

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await getProfile();
        if (active) setProfile({ id: data.id, name: data.name, email: data.email });
      } catch (err) {
        // If unauthorized, navigate to login
        nav("/login", { replace: true });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [nav]);

  const onField = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const onPwdField = (e) => setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });

  const saveProfile = async (e) => {
    e.preventDefault();
    setPfMsg("");
    setPfErr("");
    try {
      const payload = { name: profile.name, email: profile.email };
      const { data } = await updateProfile(payload);
      setProfile({ id: data.id, name: data.name, email: data.email });
      setPfMsg("Профиль обновлён");
    } catch (err) {
      setPfErr(err?.response?.data?.detail || "Не удалось обновить профиль");
    }
  };

  const doChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg("");
    setPwdErr("");
    try {
      await changePassword(pwdForm);
      setPwdMsg("Пароль изменён");
      setPwdForm({ current_password: "", new_password: "" });
    } catch (err) {
      setPwdErr(err?.response?.data?.detail || "Не удалось изменить пароль");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    nav("/", { replace: true });
  };

  if (loading) {
    return <div className="card" data-easytag="id1-react/src/components/Profile/index.jsx">Загрузка...</div>;
  }

  return (
    <div className="grid" data-easytag="id2-react/src/components/Profile/index.jsx">
      <section className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Профиль</h2>
          <button className="btn" onClick={logout}>Выйти</button>
        </div>
        {pfErr ? <div className="alert" style={{ marginTop: 12 }}>{pfErr}</div> : null}
        {pfMsg ? <div className="alert success" style={{ marginTop: 12 }}>{pfMsg}</div> : null}
        <form onSubmit={saveProfile} className="form" style={{ marginTop: 16 }} data-easytag="id3-react/src/components/Profile/index.jsx">
          <div className="field">
            <label className="label" htmlFor="name">Имя</label>
            <input id="name" name="name" className="input" value={profile.name} onChange={onField} required />
          </div>
          <div className="field">
            <label className="label" htmlFor="email">Почта</label>
            <input id="email" name="email" type="email" className="input" value={profile.email} onChange={onField} required />
          </div>
          <button className="btn" type="submit">Сохранить</button>
        </form>
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Смена пароля</h3>
        {pwdErr ? <div className="alert">{pwdErr}</div> : null}
        {pwdMsg ? <div className="alert success">{pwdMsg}</div> : null}
        <form onSubmit={doChangePassword} className="form" data-easytag="id4-react/src/components/Profile/index.jsx">
          <div className="field">
            <label className="label" htmlFor="current_password">Текущий пароль</label>
            <input id="current_password" name="current_password" type="password" className="input" value={pwdForm.current_password} onChange={onPwdField} required />
          </div>
          <div className="field">
            <label className="label" htmlFor="new_password">Новый пароль</label>
            <input id="new_password" name="new_password" type="password" className="input" value={pwdForm.new_password} onChange={onPwdField} required minLength={6} />
          </div>
          <button className="btn" type="submit">Изменить пароль</button>
        </form>
      </section>
    </div>
  );
}
