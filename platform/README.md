# Gonets Platform Starter

Monorepo starter for:
- `apps/web`: Next.js frontend
- `apps/api`: NestJS backend

## Auth (production-style)

- **Argon2** для паролей в БД
- **JWT** access token (короткий TTL)
- **refresh token** в БД (SHA-256 хранится, в cookie — сырое значение)
- **httpOnly cookies** `gonets_access` и `gonets_refresh` на ответе `POST /api/auth/login`
- `POST /api/auth/refresh` — ротация refresh
- `POST /api/auth/logout` — отзыв и очистка cookies
- `GET /api/auth/me` — профиль по access JWT
- Заказы `GET /api/orders` требуют `Authorization: Bearer` (или cookie `gonets_access`); **расчёт** `POST /api/orders/calculate` — без авторизации

## База данных

1. Поднимите PostgreSQL и скопируйте `apps/api/.env.example` в `apps/api/.env` (поправьте `DATABASE_URL` и `JWT_SECRET`).
2. `cd platform`
3. `npm run prisma:migrate --workspace @gonets/api`
4. `npm run prisma:seed --workspace @gonets/api` (тестовый пользователь `+79990000001` / `123456`)

## Quick start

1. `cd platform`
2. `npm install`
3. `npm run dev:api`
4. В другом терминале: `npm run dev:web`
5. Веб: `http://localhost:3000`, API: `http://localhost:4000/api`

Скопируйте `apps/web/.env.example` в `apps/web/.env.local` при необходимости (по умолчанию `NEXT_PUBLIC_API_BASE=http://localhost:4000/api`).

## Сборка

`npm run build` — собирает web и api.
