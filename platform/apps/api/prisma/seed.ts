import { PrismaClient, UserRole } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const hash = await argon2.hash("123456");
  await prisma.user.upsert({
    where: { phone: "+79990000001" },
    update: { passwordHash: hash },
    create: {
      phone: "+79990000001",
      name: "Илья Янчук",
      role: UserRole.CLIENT,
      passwordHash: hash
    }
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
