/*
  Warnings:

  - A unique constraint covering the columns `[usuarioId]` on the table `Gremio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Gremio_usuarioId_key" ON "Gremio"("usuarioId");
