/*
  Warnings:

  - You are about to alter the column `rating` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Int`.

*/
-- AlterTable
ALTER TABLE `Comment` MODIFY `rating` INTEGER NOT NULL;
