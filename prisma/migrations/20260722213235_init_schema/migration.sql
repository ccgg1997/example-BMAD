-- CreateTable
CREATE TABLE "repartidor" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "repartidor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_salida" (
    "id" TEXT NOT NULL,
    "numero_pedido" INTEGER NOT NULL,
    "repartidor_id" TEXT NOT NULL,
    "registrado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tarifa_aplicada" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "registro_salida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_sistema" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "tarifa_domicilio" DECIMAL(10,2) NOT NULL DEFAULT 1000,

    CONSTRAINT "configuracion_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "repartidor_nombre_key" ON "repartidor"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "registro_salida_numero_pedido_key" ON "registro_salida"("numero_pedido");

-- CreateIndex
CREATE INDEX "registro_salida_repartidor_id_idx" ON "registro_salida"("repartidor_id");

-- CreateIndex
CREATE INDEX "registro_salida_registrado_en_idx" ON "registro_salida"("registrado_en");

-- AddForeignKey
ALTER TABLE "registro_salida" ADD CONSTRAINT "registro_salida_repartidor_id_fkey" FOREIGN KEY ("repartidor_id") REFERENCES "repartidor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
