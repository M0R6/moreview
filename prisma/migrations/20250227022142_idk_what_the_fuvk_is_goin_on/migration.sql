-- AlterTable
ALTER TABLE `users` ADD COLUMN `photo` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Cast` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FilmCast` (
    `id` VARCHAR(191) NOT NULL,
    `film_id` VARCHAR(191) NOT NULL,
    `cast_id` VARCHAR(191) NOT NULL,
    `character_name` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FilmCast` ADD CONSTRAINT `FilmCast_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `Film`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FilmCast` ADD CONSTRAINT `FilmCast_cast_id_fkey` FOREIGN KEY (`cast_id`) REFERENCES `Cast`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
