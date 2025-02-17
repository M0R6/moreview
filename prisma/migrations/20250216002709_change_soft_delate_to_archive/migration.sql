/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `Film` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Film" DROP COLUMN "deleted_at",
ADD COLUMN     "archived_at" TIMESTAMP(3);
