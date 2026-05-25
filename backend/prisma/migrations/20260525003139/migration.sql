/*
  Warnings:

  - You are about to drop the column `consto` on the `Evento` table. All the data in the column will be lost.
  - You are about to alter the column `descuentoEstudiante` on the `Evento` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `descuentoProfesor` on the `Evento` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `costo` to the `Evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evento" DROP COLUMN "consto",
ADD COLUMN     "costo" INTEGER NOT NULL,
ALTER COLUMN "descuentoEstudiante" SET DEFAULT 0,
ALTER COLUMN "descuentoEstudiante" SET DATA TYPE INTEGER,
ALTER COLUMN "descuentoProfesor" SET DEFAULT 0,
ALTER COLUMN "descuentoProfesor" SET DATA TYPE INTEGER;
