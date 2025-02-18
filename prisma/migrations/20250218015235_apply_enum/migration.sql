/*
  Warnings:

  - Made the column `type` on table `Film` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Film" ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "type" DROP DEFAULT;
