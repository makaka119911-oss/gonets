import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Гонец",
  icons: { icon: "/logo-gonets.svg" }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 24, background: "#171a21", color: "#c7d5e0" }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "#c7d5e0", fontWeight: 700 }}>
            <img src="/logo-gonets.svg" width={32} height={32} alt="" />
            Гонец
          </a>
          <a href="/calculate" style={{ color: "#66c0f4" }}>
            Калькулятор
          </a>
          <a href="/tracking" style={{ color: "#66c0f4" }}>
            Трекинг
          </a>
          <a href="/history" style={{ color: "#66c0f4" }}>
            История
          </a>
          <a href="/login" style={{ color: "#66c0f4" }}>
            Вход
          </a>
        </nav>
        {children}
      </body>
    </html>
  );
}
