/*
  Warnings:

  - Added the required column `createdBy` to the `Cast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `FilmCast` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cast` ADD COLUMN `createdBy` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `FilmCast` ADD COLUMN `createdBy` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Cast` ADD CONSTRAINT `Cast_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FilmCast` ADD CONSTRAINT `FilmCast_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
