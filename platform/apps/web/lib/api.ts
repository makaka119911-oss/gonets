const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

async function request(path: string, options: RequestInit = {}, retry = true): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined)
    }
  });
  if (res.status === 401 && retry && path !== "/auth/refresh" && path !== "/auth/login") {
    const refreshed = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    if (refreshed.ok) {
      return request(path, options, false);
    }
  }
  return res;
}

export const api = {
  async login(phone: string, password: string) {
    const res = await request("/auth/login", { method: "POST", body: JSON.stringify({ phone, password }) }, false);
    if (!res.ok) throw new Error(await res.text());
    const data = (await res.json()) as { user: { id: string; name: string; phone: string; role: string } };
    if (typeof window !== "undefined") localStorage.setItem("gonets.user", JSON.stringify(data.user));
    return data;
  },
  async logout() {
    await request("/auth/logout", { method: "POST" }, false);
    if (typeof window !== "undefined") localStorage.removeItem("gonets.user");
  },
  async calculate(payload: { distance: number; weight: number; type: "walk" | "car" | "cargo"; urgency: "asap" | "plan" }) {
    const res = await request("/orders/calculate", { method: "POST", body: JSON.stringify(payload) }, false);
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<{ price: number }>;
  },
  async listOrders() {
    const res = await request("/orders");
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async getOrder(id: string) {
    const res = await request(`/orders/${id}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};
