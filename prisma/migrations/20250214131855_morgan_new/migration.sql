-- CreateEnum
CREATE TYPE "Role" AS ENUM ('subs', 'admin', 'author');

-- CreateEnum
CREATE TYPE "CommentRating" AS ENUM ('bad', 'good', 'excellent');

-- CreateEnum
CREATE TYPE "Rate" AS ENUM ('G', 'PG', 'PG13', 'R', 'NC17');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Film" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "poster" TEXT,
    "description" TEXT,
    "release_year" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "rating" "Rate" NOT NULL,
    "watchlist" INTEGER,
    "creator" TEXT NOT NULL,
    "trailer" TEXT,
    "postedBy" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Film_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenreRelation" (
    "id" TEXT NOT NULL,
    "film_id" TEXT NOT NULL,
    "genre_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenreRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Casting" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "film_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Casting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" "CommentRating" NOT NULL,
    "user_id" TEXT NOT NULL,
    "film_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "GenreRelation" ADD CONSTRAINT "GenreRelation_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenreRelation" ADD CONSTRAINT "GenreRelation_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Casting" ADD CONSTRAINT "Casting_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
