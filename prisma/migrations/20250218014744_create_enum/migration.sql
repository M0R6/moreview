/*
  Warnings:

  - The values [bad,good,excellent] on the enum `CommentRating` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `type` to the `Film` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "movieType" AS ENUM ('movie', 'series');

-- AlterEnum
BEGIN;
CREATE TYPE "CommentRating_new" AS ENUM ('one', 'two', 'three', 'four', 'five');
ALTER TABLE "Comment" ALTER COLUMN "rating" TYPE "CommentRating_new" USING ("rating"::text::"CommentRating_new");
ALTER TYPE "CommentRating" RENAME TO "CommentRating_old";
ALTER TYPE "CommentRating_new" RENAME TO "CommentRating";
DROP TYPE "CommentRating_old";
COMMIT;

-- AlterTable
ALTER TABLE "Film" ADD COLUMN     "type" "movieType" DEFAULT 'movie';
