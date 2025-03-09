-- DropForeignKey
ALTER TABLE `GenreRelation` DROP FOREIGN KEY `GenreRelation_genre_id_fkey`;

-- AddForeignKey
ALTER TABLE `GenreRelation` ADD CONSTRAINT `GenreRelation_genre_id_fkey` FOREIGN KEY (`genre_id`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
