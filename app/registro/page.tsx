import { prisma } from "@/lib/db/client";
import { RegistroSalidaForm } from "@/components/registro-salida-form";

// Sin esto, Next.js prerenderiza la lista de repartidores una sola vez en
// build time y la sirve como HTML estático — un repartidor nuevo o
// desactivado no se reflejaría hasta el próximo deploy.
export const dynamic = "force-dynamic";

export default async function RegistroPage() {
  const repartidores = await prisma.repartidor.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 p-4">
      <h1 className="text-lg font-semibold">Registro de Salida</h1>
      <RegistroSalidaForm repartidores={repartidores} />
    </main>
  );
}
