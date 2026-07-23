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
    <>
      <div>
        <h1 className="text-2xl leading-tight font-bold">Registro de salida</h1>
        <p className="text-sm text-muted-foreground">Registra pedidos rápidamente</p>
      </div>
      <RegistroSalidaForm repartidores={repartidores} />
    </>
  );
}
