 "use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Order = { id: string; from: string; to: string; status: string; price: number };

export default function TrackingPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getOrder("GN-20481").then(setOrder).catch(() => setError("Требуется вход на странице Login"));
  }, []);

  return (
    <main>
      <h1>Tracking</h1>
      {error && <p>{error}</p>}
      {order && (
        <p>
          {order.id}: {order.from} → {order.to}, статус: {order.status}
        </p>
      )}
    </main>
  );
}
