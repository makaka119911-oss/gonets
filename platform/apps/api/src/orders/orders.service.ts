import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Order, OrderEvent, OrderStatus, Prisma, ShipmentCategory, UserRole } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

/** Ответ API: совместимость со статическим сайтом (snake_case статусы) + новые поля */
export type OrderApi = {
  id: string;
  code: string;
  from: string;
  to: string;
  price: number;
  status: string;
  statusLabel: string;
  shipmentCategory: string;
  shipmentCategoryLabel: string;
  etaMin: number;
  createdAt: string;
  courierId: string | null;
  sellerId: string | null;
  events: { time: string; title: string }[];
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  CREATED: "Создан",
  CONFIRMED: "Подтверждён",
  COURIER_ASSIGNED: "Курьер назначен",
  COURIER_ON_WAY: "Курьер в пути",
  PICKED_UP: "Забрано",
  IN_TRANSIT: "В пути",
  AT_RECIPIENT: "У получателя",
  DELIVERED: "Доставлено",
  CANCELED: "Отменено",
  FAILED: "Сбой"
};

const CATEGORY_LABELS: Record<ShipmentCategory, string> = {
  FOOD: "Еда",
  PARCEL: "Посылки",
  DOCUMENTS: "Документы",
  GOODS: "Товары",
  BULKY: "Крупногабарит"
};

function statusToApi(s: OrderStatus): string {
  return s.toLowerCase();
}

function categoryToApi(c: ShipmentCategory): string {
  return c.toLowerCase();
}

function mapOrder(
  order: Order & {
    events: OrderEvent[];
  }
): OrderApi {
  const etaMin =
    order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELED ? 0 : 22;
  return {
    id: order.code,
    code: order.code,
    from: order.from,
    to: order.to,
    price: order.price,
    status: statusToApi(order.status),
    statusLabel: STATUS_LABELS[order.status],
    shipmentCategory: categoryToApi(order.shipmentCategory),
    shipmentCategoryLabel: CATEGORY_LABELS[order.shipmentCategory],
    etaMin,
    createdAt: order.createdAt.toISOString(),
    courierId: order.courierId,
    sellerId: order.sellerId,
    events: order.events.map((e) => ({
      time: e.createdAt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      title: e.title
    }))
  };
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private whereForRole(userId: string, role: UserRole): Prisma.OrderWhereInput {
    if (role === UserRole.ADMIN) return {};
    if (role === UserRole.CLIENT) return { clientId: userId };
    if (role === UserRole.COURIER) return { courierId: userId };
    if (role === UserRole.SELLER) return { sellerId: userId };
    return { id: "__none__" };
  }

  async listForUser(userId: string, role: UserRole) {
    const rows = await this.prisma.order.findMany({
      where: this.whereForRole(userId, role),
      include: { events: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" }
    });
    return rows.map(mapOrder);
  }

  async getForUser(identifier: string, userId: string, role: UserRole): Promise<OrderApi> {
    const row = await this.prisma.order.findFirst({
      where: { OR: [{ id: identifier }, { code: identifier }] },
      include: { events: { orderBy: { createdAt: "asc" } } }
    });
    if (!row) throw new NotFoundException("Order not found");
    const allowed =
      role === UserRole.ADMIN ||
      row.clientId === userId ||
      row.courierId === userId ||
      row.sellerId === userId;
    if (!allowed) throw new ForbiddenException();
    return mapOrder(row);
  }

  calculate(payload: { distance: number; weight: number; type: "walk" | "car" | "cargo"; urgency: "asap" | "plan" }) {
    const base = 250;
    const perKm = payload.type === "cargo" ? 70 : payload.type === "car" ? 45 : 25;
    const perKg = payload.type === "cargo" ? 18 : 8;
    const multiplier = payload.urgency === "asap" ? 1.2 : 1;
    return { price: Math.round((base + payload.distance * perKm + payload.weight * perKg) * multiplier) };
  }
}
