/*
  Warnings:

  - Added the required column `tipo` to the `Evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evento" ADD COLUMN     "tipo" "TipoEvento" NOT NULL;
