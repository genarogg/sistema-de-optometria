-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AccionesBitacora" ADD VALUE 'GENERACION_CARNET';
ALTER TYPE "AccionesBitacora" ADD VALUE 'GENERACION_CARNET_PONENTE';
ALTER TYPE "AccionesBitacora" ADD VALUE 'GENERACION_SOLVENCIA_PAGO';
ALTER TYPE "AccionesBitacora" ADD VALUE 'GENERACION_COMPROBANTE_PAGO';
ALTER TYPE "AccionesBitacora" ADD VALUE 'GENERACION_CERTIFICADO_TALLER';
ALTER TYPE "AccionesBitacora" ADD VALUE 'GENERACION_CERTIFICADO_DIPLOMADO';
ALTER TYPE "AccionesBitacora" ADD VALUE 'GENERACION_CERTIFICADO_CONGRESO';
