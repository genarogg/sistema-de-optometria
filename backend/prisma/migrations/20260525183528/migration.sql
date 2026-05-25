-- CreateEnum
CREATE TYPE "AccionesBitacora" AS ENUM ('LOGIN', 'CREATE_ADMIN', 'CREATE_USER', 'UPDATE_ADMIN', 'UPDATE_USER', 'DELETE_ADMIN', 'DELETE_USER', 'VIEW', 'ERROR', 'GET_USUARIOS', 'CREAR_PLAN_SUSCRIPCION', 'UPDATE_PLAN_SUSCRIPCION', 'CREAR_SUSCRIPCION', 'VALIDAR_SUSCRIPCION', 'RECHAZAR_SUSCRIPCION', 'VENCIADA_SUSCRIPCION', 'GENERACION_CARNET', 'GENERACION_CARNET_PONENTE', 'GENERACION_SOLVENCIA_PAGO', 'GENERACION_COMPROBANTE_PAGO', 'GENERACION_CERTIFICADO_TALLER', 'GENERACION_CERTIFICADO_DIPLOMADO', 'GENERACION_CERTIFICADO_CONGRESO', 'CREAR_EVENTO', 'UPDATE_EVENTO', 'USUARIO_AGG_AL_EVENTO');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SUPER_USUARIO', 'ADMINISTRADOR', 'AGREMIADO_SOLVENTE', 'AGREMIADO_INSOLVENTE', 'PROFESOR', 'ESTUDIANTE', 'VISITANTE');

-- CreateEnum
CREATE TYPE "TipoAutoridad" AS ENUM ('PRESIDENTE', 'VICEPRESIDENTE');

-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('TALLER', 'DIPLOMADO', 'CONGRESO');

-- CreateEnum
CREATE TYPE "TipoSuscripcion" AS ENUM ('AGREMIADO', 'ESTUDIANTE', 'PROFESOR');

-- CreateEnum
CREATE TYPE "EstatusSuscripcion" AS ENUM ('PENDIENTE', 'VALIDADO', 'VENCIDO', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "EstatusPagoEvento" AS ENUM ('PENDIENTE', 'PAGADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "NivelAcademico" AS ENUM ('LICENCIADO', 'TSU', 'NO_ASIGNADO');

-- CreateEnum
CREATE TYPE "TipoDeDocumento" AS ENUM ('CARNET', 'CARNET_PONENTE', 'SOLVENCIA_PAGO', 'COMPROBANTE_PAGO', 'CERTIFICADO_TALLER', 'CERTIFICADO_DIPLOMADO', 'CERTIFICADO_CONGRESO');

-- CreateEnum
CREATE TYPE "VigenciaEvento" AS ENUM ('VIGENTE', 'CANCELADO', 'CONCLUIDO');

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
    "vigente" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Autoridad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gremio" (
    "id" SERIAL NOT NULL,
    "numeroGremio" INTEGER NOT NULL,
    "nivelAcademico" "NivelAcademico" NOT NULL DEFAULT 'NO_ASIGNADO',
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
    "costo" INTEGER NOT NULL,
    "tipo" "TipoEvento" NOT NULL,
    "descuentoEstudiante" INTEGER NOT NULL DEFAULT 0,
    "descuentoProfesor" INTEGER NOT NULL DEFAULT 0,
    "vigencia" "VigenciaEvento" NOT NULL DEFAULT 'VIGENTE',
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanSuscripcion" (
    "id" SERIAL NOT NULL,
    "costo" INTEGER NOT NULL,
    "tipo" "TipoSuscripcion" NOT NULL,
    "isActivo" BOOLEAN NOT NULL DEFAULT true,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanSuscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PonenteEvento" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "isActivo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PonenteEvento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuscripcionEvento" (
    "id" SERIAL NOT NULL,
    "precioAlSuscripcion" INTEGER NOT NULL,
    "estatus" "EstatusPagoEvento" NOT NULL DEFAULT 'PENDIENTE',
    "comprobante" TEXT NOT NULL,
    "comprobanteImg" TEXT NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuscripcionEvento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suscripcion" (
    "id" SERIAL NOT NULL,
    "estatus" "EstatusSuscripcion" NOT NULL,
    "comprobante" INTEGER DEFAULT 0,
    "comprobanteImg" TEXT NOT NULL,
    "contodesuscripcion" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "suscripcionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentoSolicitado" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "autoridadId" INTEGER NOT NULL,
    "tipo" "TipoDeDocumento" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentoSolicitado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cedula_key" ON "Usuario"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Autoridad_usuarioId_key" ON "Autoridad"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Gremio_numeroGremio_key" ON "Gremio"("numeroGremio");

-- CreateIndex
CREATE UNIQUE INDEX "Gremio_usuarioId_key" ON "Gremio"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "PonenteEvento_usuarioId_eventoId_key" ON "PonenteEvento"("usuarioId", "eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "SuscripcionEvento_usuarioId_eventoId_key" ON "SuscripcionEvento"("usuarioId", "eventoId");

-- AddForeignKey
ALTER TABLE "Autoridad" ADD CONSTRAINT "Autoridad_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gremio" ADD CONSTRAINT "Gremio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bitacora" ADD CONSTRAINT "Bitacora_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSuscripcion" ADD CONSTRAINT "PlanSuscripcion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PonenteEvento" ADD CONSTRAINT "PonenteEvento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PonenteEvento" ADD CONSTRAINT "PonenteEvento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuscripcionEvento" ADD CONSTRAINT "SuscripcionEvento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuscripcionEvento" ADD CONSTRAINT "SuscripcionEvento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suscripcion" ADD CONSTRAINT "Suscripcion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suscripcion" ADD CONSTRAINT "Suscripcion_suscripcionId_fkey" FOREIGN KEY ("suscripcionId") REFERENCES "PlanSuscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoSolicitado" ADD CONSTRAINT "DocumentoSolicitado_autoridadId_fkey" FOREIGN KEY ("autoridadId") REFERENCES "Autoridad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoSolicitado" ADD CONSTRAINT "DocumentoSolicitado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
