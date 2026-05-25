/*
  Warnings:

  - You are about to drop the column `descuento` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Evento` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VigenciaEvento" AS ENUM ('VIGENTE', 'CANCELADO', 'CONCLUIDO');

-- AlterTable
ALTER TABLE "Evento" DROP COLUMN "descuento",
DROP COLUMN "tipo",
ADD COLUMN     "descuentoEstudiante" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "descuentoProfesor" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "vigencia" "VigenciaEvento" NOT NULL DEFAULT 'VIGENTE';

-- AlterTable
ALTER TABLE "Ponente_Evento" ADD COLUMN     "isActivo" BOOLEAN NOT NULL DEFAULT true;
