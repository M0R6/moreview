/*
  Warnings:

  - You are about to drop the `Casting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CastingRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CastingRelation" DROP CONSTRAINT "CastingRelation_casting_id_fkey";

-- DropForeignKey
ALTER TABLE "CastingRelation" DROP CONSTRAINT "CastingRelation_film_id_fkey";

-- AlterTable
ALTER TABLE "Film" ADD COLUMN     "cast" TEXT[];

-- DropTable
DROP TABLE "Casting";

-- DropTable
DROP TABLE "CastingRelation";
