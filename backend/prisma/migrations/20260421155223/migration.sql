/*
  Warnings:

  - You are about to drop the column `accion` on the `Bitacora` table. All the data in the column will be lost.
  - You are about to drop the column `hora` on the `Bitacora` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `Bitacora` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bitacora" DROP COLUMN "accion",
DROP COLUMN "hora",
DROP COLUMN "ip",
ALTER COLUMN "fecha" SET DEFAULT CURRENT_TIMESTAMP;
