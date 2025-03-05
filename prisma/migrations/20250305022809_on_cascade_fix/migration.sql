-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_film_id_fkey`;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `Film`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
