-- CreateEnum
CREATE TYPE "AccionesBitacora" AS ENUM ('LOGIN', 'CREATE_ADMIN', 'CREATE_USER', 'UPDATE_ADMIN', 'UPDATE_USER', 'DELETE_ADMIN', 'DELETE_USER', 'VIEW', 'ERROR', 'GET_USUARIOS');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SUPER_USUARIO', 'ADMINISTRADOR', 'AGREMIADO', 'PROFESOR', 'ESTUDIANTE', 'VISITANTE');

-- CreateEnum
CREATE TYPE "TipoAutoridad" AS ENUM ('presidente', 'vicepresidente');

-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('taller', 'diplomado', 'congreso');

-- CreateEnum
CREATE TYPE "TipoSuscripcion" AS ENUM ('agremiado_solvente', 'agremiado_insolvente', 'estudiante', 'profesor');

-- CreateEnum
CREATE TYPE "EstatusSuscripcion" AS ENUM ('pendiente', 'validado', 'vencido');

-- CreateEnum
CREATE TYPE "NivelAcademico" AS ENUM ('licenciado', 'tsu');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "primerNombre" TEXT NOT NULL,
    "segundoNombre" TEXT,
    "primerApellido" TEXT NOT NULL,
    "segundoApellido" TEXT,
    "avatar" TEXT,
    "telefono" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'VISITANTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

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
    "nivelAcademico" "NivelAcademico" NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gremio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bitacora" (
    "id" SERIAL NOT NULL,
    "type" "AccionesBitacora" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mensaje" TEXT,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Bitacora_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "SuscripcionPrecio" (
    "id" SERIAL NOT NULL,
    "costo" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuscripcionPrecio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suscripcion" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoSuscripcion" NOT NULL,
    "estatus" "EstatusSuscripcion" NOT NULL,
    "comprobante" INTEGER NOT NULL,
    "comprobanteImg" TEXT NOT NULL,
    "contodesuscripcion" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "isActivo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cedula_key" ON "Usuario"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Gremio_numeroGremio_key" ON "Gremio"("numeroGremio");

-- CreateIndex
CREATE UNIQUE INDEX "Ponente_Evento_usuarioId_eventoId_key" ON "Ponente_Evento"("usuarioId", "eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "Suscripcion_Evento_usuarioId_eventoId_key" ON "Suscripcion_Evento"("usuarioId", "eventoId");

-- AddForeignKey
ALTER TABLE "Autoridad" ADD CONSTRAINT "Autoridad_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gremio" ADD CONSTRAINT "Gremio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bitacora" ADD CONSTRAINT "Bitacora_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "SuscripcionPrecio" ADD CONSTRAINT "SuscripcionPrecio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suscripcion" ADD CONSTRAINT "Suscripcion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
