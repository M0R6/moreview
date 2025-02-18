-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Rate" ADD VALUE 'TVY';
ALTER TYPE "Rate" ADD VALUE 'TVY7';
ALTER TYPE "Rate" ADD VALUE 'TVG';
ALTER TYPE "Rate" ADD VALUE 'TVPG';
ALTER TYPE "Rate" ADD VALUE 'TV14';
ALTER TYPE "Rate" ADD VALUE 'TVMA';
