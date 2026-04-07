 "use client";

import { useState } from "react";
import { api } from "../../lib/api";

export default function LoginPage() {
  const [phone, setPhone] = useState("+79990000001");
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await api.login(phone, password);
      setMessage(`Вход успешен: ${data.user.name}`);
    } catch {
      setMessage("Ошибка входа");
    }
  }

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        <button type="submit">Войти</button>
      </form>
      <p>{message}</p>
    </main>
  );
}
