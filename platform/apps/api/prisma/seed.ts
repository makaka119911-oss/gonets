import { OrderStatus, PrismaClient, ShipmentCategory, UserRole } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const hash = await argon2.hash("123456");

  const client = await prisma.user.upsert({
    where: { phone: "+79990000001" },
    update: { passwordHash: hash, role: UserRole.CLIENT },
    create: {
      phone: "+79990000001",
      name: "Илья Янчук",
      role: UserRole.CLIENT,
      passwordHash: hash
    }
  });

  const courier = await prisma.user.upsert({
    where: { phone: "+79990000002" },
    update: { passwordHash: hash },
    create: {
      phone: "+79990000002",
      name: "Курьер Тест",
      role: UserRole.COURIER,
      passwordHash: hash
    }
  });

  const seller = await prisma.user.upsert({
    where: { phone: "+79990000003" },
    update: { passwordHash: hash },
    create: {
      phone: "+79990000003",
      name: "Магазин «Тест»",
      role: UserRole.SELLER,
      passwordHash: hash
    }
  });

  await prisma.user.upsert({
    where: { phone: "+79990000004" },
    update: { passwordHash: hash },
    create: {
      phone: "+79990000004",
      name: "Админ",
      role: UserRole.ADMIN,
      passwordHash: hash
    }
  });

  const orders = [
    {
      code: "GN-20481",
      from: "Москва, ул. Правды, 24",
      to: "Москва, Цветной бульвар, 30",
      price: 980,
      status: OrderStatus.COURIER_ON_WAY,
      shipmentCategory: ShipmentCategory.PARCEL,
      courierId: courier.id,
      sellerId: null as string | null,
      events: [
        "Заказ принят системой",
        "Курьер назначен",
        "Курьер едет к отправителю",
        "Посылка получена курьером",
        "Курьер в пути к получателю"
      ]
    },
    {
      code: "GN-20459",
      from: "Москва, Арбат, 12",
      to: "Москва, Петровка, 19",
      price: 760,
      status: OrderStatus.DELIVERED,
      shipmentCategory: ShipmentCategory.DOCUMENTS,
      courierId: courier.id,
      sellerId: null as string | null,
      events: ["Заказ создан", "Доставлено"]
    },
    {
      code: "GN-20420",
      from: "Москва, Ленинский проспект, 5",
      to: "Москва, Сущевский вал, 11",
      price: 1290,
      status: OrderStatus.DELIVERED,
      shipmentCategory: ShipmentCategory.GOODS,
      courierId: courier.id,
      sellerId: seller.id,
      events: ["Заказ от магазина", "Передано курьеру", "Доставлено"]
    }
  ];

  for (const o of orders) {
    await prisma.order.upsert({
      where: { code: o.code },
      update: {
        status: o.status,
        shipmentCategory: o.shipmentCategory,
        courierId: o.courierId,
        sellerId: o.sellerId
      },
      create: {
        code: o.code,
        from: o.from,
        to: o.to,
        price: o.price,
        status: o.status,
        shipmentCategory: o.shipmentCategory,
        clientId: client.id,
        courierId: o.courierId,
        sellerId: o.sellerId,
        events: {
          create: o.events.map((title) => ({ title }))
        }
      }
    });
  }

  console.log("Seed OK: users + orders (client / courier / seller / admin — пароль 123456)");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
