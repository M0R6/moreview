-- DropForeignKey
ALTER TABLE `Film` DROP FOREIGN KEY `Film_postedBy_fkey`;

-- AlterTable
ALTER TABLE `Film` MODIFY `postedBy` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Film` ADD CONSTRAINT `Film_postedBy_fkey` FOREIGN KEY (`postedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
