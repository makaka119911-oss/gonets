 "use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Order = { id: string; from: string; to: string; status: string; price: number };

export default function HistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.listOrders().then(setOrders).catch(() => setError("Требуется вход на странице Login"));
  }, []);

  return (
    <main>
      <h1>History</h1>
      {error && <p>{error}</p>}
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            {o.id}: {o.from} → {o.to} ({o.status}) {o.price} ₽
          </li>
        ))}
      </ul>
    </main>
  );
}
