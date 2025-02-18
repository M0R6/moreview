/*
  Warnings:

  - You are about to drop the column `type` on the `Film` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Film" DROP COLUMN "type",
ADD COLUMN     "typeMov" "movieType" NOT NULL DEFAULT 'movie';
