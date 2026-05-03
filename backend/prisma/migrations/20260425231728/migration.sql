/*
  Warnings:

  - You are about to drop the column `name` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cedula]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cedula` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primerApellido` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primerNombre` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "name",
ADD COLUMN     "cedula" TEXT NOT NULL,
ADD COLUMN     "primerApellido" TEXT NOT NULL,
ADD COLUMN     "primerNombre" TEXT NOT NULL,
ADD COLUMN     "telefono" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cedula_key" ON "Usuario"("cedula");
