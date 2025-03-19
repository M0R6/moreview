/*
  Warnings:

  - Added the required column `description` to the `Film` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Film` ADD COLUMN `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `notlp` INTEGER NOT NULL DEFAULT 0;
