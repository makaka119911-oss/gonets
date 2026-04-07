# Architecture Draft — Гонец

## Технологический контур (рекомендация)

- Web: Next.js + TypeScript.
- Mobile client: Flutter.
- Backend: NestJS.
- DB: PostgreSQL.
- Cache/queues: Redis.
- Realtime: WebSocket gateway.
- Storage: S3-совместимое хранилище для фото.

## Сервисы (MVP)

1. API Gateway
- авторизация;
- rate limits;
- маршрутизация к внутренним сервисам.

2. Order Service
- создание/обновление заказа;
- расчет цены;
- статусы и SLA.

3. Courier Service
- профиль/верификация;
- доступные заказы;
- рейтинг.

4. Tracking Service
- геопозиции курьера;
- realtime обновления клиенту и админке.

5. Billing Service
- оплата заказов;
- выплаты курьерам;
- возвраты.

6. Notification Service
- push, sms, email;
- шаблоны сообщений.

## Схема данных (упрощенно)

- `users` (client/courier/admin)
- `orders`
- `order_events`
- `order_locations`
- `payments`
- `courier_wallets`
- `payouts`
- `attachments`

## Основные API (черновик)

- `POST /v1/orders/calculate`
- `POST /v1/orders`
- `GET /v1/orders/{id}`
- `POST /v1/orders/{id}/cancel`
- `POST /v1/courier/orders/{id}/accept`
- `POST /v1/courier/orders/{id}/status`
- `POST /v1/payments/create`
- `POST /v1/payouts/request`

## Безопасность и соответствие

- HTTPS везде.
- JWT + refresh token.
- 2FA для админов.
- Логи доступа и действий админов (audit log).
- Политика хранения персональных данных по 152-ФЗ.
