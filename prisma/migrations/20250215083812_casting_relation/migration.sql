/*
  Warnings:

  - You are about to drop the column `film_id` on the `Casting` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Casting" DROP CONSTRAINT "Casting_film_id_fkey";

-- AlterTable
ALTER TABLE "Casting" DROP COLUMN "film_id",
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CastingRelation" (
    "id" TEXT NOT NULL,
    "film_id" TEXT NOT NULL,
    "casting_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CastingRelation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CastingRelation" ADD CONSTRAINT "CastingRelation_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CastingRelation" ADD CONSTRAINT "CastingRelation_casting_id_fkey" FOREIGN KEY ("casting_id") REFERENCES "Casting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
