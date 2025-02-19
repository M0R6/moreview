-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('subs', 'admin', 'author') NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Film` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `poster` VARCHAR(191) NULL,
    `typeMov` ENUM('movie', 'series') NOT NULL DEFAULT 'movie',
    `description` VARCHAR(191) NULL,
    `release_year` INTEGER NOT NULL,
    `duration` INTEGER NULL,
    `episode` INTEGER NULL,
    `rating` ENUM('G', 'PG', 'PG13', 'R', 'NC17', 'TVY', 'TVY7', 'TVG', 'TVPG', 'TV14', 'TVMA') NOT NULL,
    `watchlist` INTEGER NULL,
    `creator` VARCHAR(191) NOT NULL,
    `cast` VARCHAR(191) NOT NULL,
    `trailer` VARCHAR(191) NULL,
    `trailerUrl` VARCHAR(191) NULL,
    `postedBy` VARCHAR(191) NOT NULL,
    `archived_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Genre` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenreRelation` (
    `id` VARCHAR(191) NOT NULL,
    `film_id` VARCHAR(191) NOT NULL,
    `genre_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(191) NOT NULL,
    `rating` ENUM('one', 'two', 'three', 'four', 'five') NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `film_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Film` ADD CONSTRAINT `Film_postedBy_fkey` FOREIGN KEY (`postedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreRelation` ADD CONSTRAINT `GenreRelation_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `Film`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreRelation` ADD CONSTRAINT `GenreRelation_genre_id_fkey` FOREIGN KEY (`genre_id`) REFERENCES `Genre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `Film`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
