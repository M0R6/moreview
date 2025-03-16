/*
  Warnings:

  - Made the column `postedBy` on table `Film` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Cast` DROP FOREIGN KEY `Cast_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `Film` DROP FOREIGN KEY `Film_postedBy_fkey`;

-- DropForeignKey
ALTER TABLE `FilmCast` DROP FOREIGN KEY `FilmCast_createdBy_fkey`;

-- AlterTable
ALTER TABLE `Film` MODIFY `postedBy` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Film` ADD CONSTRAINT `Film_postedBy_fkey` FOREIGN KEY (`postedBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cast` ADD CONSTRAINT `Cast_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FilmCast` ADD CONSTRAINT `FilmCast_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
