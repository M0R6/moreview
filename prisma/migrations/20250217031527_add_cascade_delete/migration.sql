-- DropForeignKey
ALTER TABLE "GenreRelation" DROP CONSTRAINT "GenreRelation_film_id_fkey";

-- AddForeignKey
ALTER TABLE "GenreRelation" ADD CONSTRAINT "GenreRelation_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "Film"("id") ON DELETE CASCADE ON UPDATE CASCADE;
