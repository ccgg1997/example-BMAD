import { prisma } from "../lib/db/client";

const REPARTIDORES_INICIALES = ["Carlos", "Diego", "Andrés"];
const TARIFA_INICIAL = 1000;

async function main() {
  for (const nombre of REPARTIDORES_INICIALES) {
    await prisma.repartidor.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  await prisma.configuracionSistema.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", tarifaDomicilio: TARIFA_INICIAL },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
