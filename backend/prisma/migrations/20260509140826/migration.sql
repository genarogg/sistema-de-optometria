/*
  Warnings:

  - The values [ADMIN,ASISTENTE,CLIENTE] on the enum `Rol` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `numeroGremino` on the `Usuario` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoAutoridad" AS ENUM ('presidente', 'vicepresidente');

-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('taller', 'diplomado', 'congreso');

-- CreateEnum
CREATE TYPE "TipoSuscripcion" AS ENUM ('agremiado_solvente', 'agremiado_insolvente', 'estudiante', 'profesor');

-- CreateEnum
CREATE TYPE "EstatusSuscripcion" AS ENUM ('pendiente', 'validado', 'vencido');

-- AlterEnum
BEGIN;
CREATE TYPE "Rol_new" AS ENUM ('SUPER_USUARIO', 'ADMINISTRADOR', 'AGREMIADO', 'PROFESOR', 'ESTUDIANTE', 'VISITANTE');
ALTER TABLE "public"."Usuario" ALTER COLUMN "rol" DROP DEFAULT;
ALTER TABLE "Usuario" ALTER COLUMN "rol" TYPE "Rol_new" USING ("rol"::text::"Rol_new");
ALTER TYPE "Rol" RENAME TO "Rol_old";
ALTER TYPE "Rol_new" RENAME TO "Rol";
DROP TYPE "public"."Rol_old";
ALTER TABLE "Usuario" ALTER COLUMN "rol" SET DEFAULT 'VISITANTE';
COMMIT;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "numeroGremino",
ALTER COLUMN "rol" SET DEFAULT 'VISITANTE';

-- CreateTable
CREATE TABLE "Autoridad" (
    "id" SERIAL NOT NULL,
    "firma" TEXT NOT NULL,
    "tipoAutoridad" "TipoAutoridad" NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Autoridad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gremio" (
    "id" SERIAL NOT NULL,
    "numeroGremio" INTEGER NOT NULL,
    "nivelAcademico" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gremio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "lugar" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "descuento" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tipo" "TipoEvento" NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ponente_Evento" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ponente_Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suscripcion_Evento" (
    "id" SERIAL NOT NULL,
    "precioAlSuscripcion" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suscripcion_Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suscripcion" (
    "id" SERIAL NOT NULL,
    "gremioId" INTEGER NOT NULL,
    "tipo" "TipoSuscripcion" NOT NULL,
    "estatus" "EstatusSuscripcion" NOT NULL,
    "comprobante" INTEGER NOT NULL,
    "comprobanteImg" TEXT NOT NULL,
    "contodesuscripcion" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ponente_Evento_usuarioId_eventoId_key" ON "Ponente_Evento"("usuarioId", "eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "Suscripcion_Evento_usuarioId_eventoId_key" ON "Suscripcion_Evento"("usuarioId", "eventoId");

-- AddForeignKey
ALTER TABLE "Autoridad" ADD CONSTRAINT "Autoridad_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gremio" ADD CONSTRAINT "Gremio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ponente_Evento" ADD CONSTRAINT "Ponente_Evento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ponente_Evento" ADD CONSTRAINT "Ponente_Evento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suscripcion_Evento" ADD CONSTRAINT "Suscripcion_Evento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suscripcion_Evento" ADD CONSTRAINT "Suscripcion_Evento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suscripcion" ADD CONSTRAINT "Suscripcion_gremioId_fkey" FOREIGN KEY ("gremioId") REFERENCES "Gremio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
