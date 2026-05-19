/*
  Warnings:

  - A unique constraint covering the columns `[usuarioId]` on the table `Autoridad` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Autoridad_usuarioId_key" ON "Autoridad"("usuarioId");
