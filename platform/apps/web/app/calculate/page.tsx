 "use client";

import { useState } from "react";
import { api } from "../../lib/api";

export default function CalculatePage() {
  const [distance, setDistance] = useState(10);
  const [weight, setWeight] = useState(1.5);
  const [type, setType] = useState<"walk" | "car" | "cargo">("walk");
  const [urgency, setUrgency] = useState<"asap" | "plan">("asap");
  const [price, setPrice] = useState<number | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = await api.calculate({ distance, weight, type, urgency });
    setPrice(data.price);
  }

  return (
    <main>
      <h1>Calculate</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
        <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
        <select value={type} onChange={(e) => setType(e.target.value as "walk" | "car" | "cargo")}>
          <option value="walk">Пеший</option>
          <option value="car">Авто</option>
          <option value="cargo">Грузовой</option>
        </select>
        <select value={urgency} onChange={(e) => setUrgency(e.target.value as "asap" | "plan")}>
          <option value="asap">Срочно</option>
          <option value="plan">Ко времени</option>
        </select>
        <button type="submit">Рассчитать</button>
      </form>
      {price !== null && <p>Цена: {price} ₽</p>}
    </main>
  );
}
