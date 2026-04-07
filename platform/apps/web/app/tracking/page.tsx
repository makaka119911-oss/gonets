"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type OrderDetail = {
  id: string;
  from: string;
  to: string;
  status: string;
  statusLabel?: string;
  shipmentCategoryLabel?: string;
  price: number;
  etaMin: number;
  events: { time: string; title: string }[];
};

export default function TrackingPage() {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getOrder("GN-20481")
      .then(setOrder)
      .catch(() => setError("Требуется вход на странице Login"));
  }, []);

  return (
    <main style={{ padding: "1.5rem", maxWidth: 560 }}>
      <h1>Трекинг</h1>
      {error && <p>{error}</p>}
      {order && (
        <>
          <p>
            <strong>{order.id}</strong>: {order.from} → {order.to}
          </p>
          <p>Категория: {order.shipmentCategoryLabel ?? "—"}</p>
          <p>
            Статус: {order.statusLabel ?? order.status}, осталось ~{order.etaMin} мин, цена {order.price} ₽
          </p>
          <ul>
            {(order.events ?? []).map((e, i) => (
              <li key={i}>
                <strong>{e.time}</strong> — {e.title}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
