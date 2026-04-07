import { Injectable } from "@nestjs/common";

@Injectable()
export class OrdersService {
  private orders = [
    { id: "GN-20481", from: "Москва, ул. Правды, 24", to: "Москва, Цветной бульвар, 30", status: "courier_on_way", price: 980 },
    { id: "GN-20459", from: "Москва, Арбат, 12", to: "Москва, Петровка, 19", status: "delivered", price: 760 }
  ];

  list() {
    return this.orders;
  }

  get(id: string) {
    return this.orders.find((o) => o.id === id) ?? null;
  }

  calculate(payload: { distance: number; weight: number; type: "walk" | "car" | "cargo"; urgency: "asap" | "plan" }) {
    const base = 250;
    const perKm = payload.type === "cargo" ? 70 : payload.type === "car" ? 45 : 25;
    const perKg = payload.type === "cargo" ? 18 : 8;
    const multiplier = payload.urgency === "asap" ? 1.2 : 1;
    return { price: Math.round((base + payload.distance * perKm + payload.weight * perKg) * multiplier) };
  }
}
