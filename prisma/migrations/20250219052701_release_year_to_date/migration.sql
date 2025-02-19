/*
  Warnings:

  - You are about to drop the column `release_year` on the `Film` table. All the data in the column will be lost.
  - Added the required column `release_date` to the `Film` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Film` DROP COLUMN `release_year`,
    ADD COLUMN `release_date` DATETIME(3) NOT NULL;
