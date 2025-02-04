// server/api/films/[id].put.ts
export default defineEventHandler(async (event) => {
   const { params } = event.context;
   if (!params || !params.id) {
     throw new Error("Missing film ID");
   }
   const { id } = params;
   const body = await readBody(event);
 
   // Update the film
   const updatedFilm = await prisma.film.update({
     where: { id },
     data: {
       title: body.title,
       description: body.description,
       poster: body.poster,
       release_year: body.release_year,
       duration: body.duration,
       rating: body.rating,
       creator: body.creator,
       trailer: body.trailer,
       updated_at: new Date(),
     },
   });
 
   // Update genre relations
   if (body.genreIds && body.genreIds.length > 0) {
     // Delete existing genre relations
     await prisma.genreRelation.deleteMany({
       where: { film_id: id },
     });
 
     // Create new genre relations
     await prisma.genreRelation.createMany({
       data: body.genreIds.map((genreId: string) => ({
         film_id: id,
         genre_id: genreId,
         created_at: new Date(),
         updated_at: new Date(),
       })),
     });
   }
 
   // Fetch the updated film with its genre relations
   const filmWithGenres = await prisma.film.findUnique({
     where: { id },
     include: {
       genres_relations: {
         include: {
           genre: true, // Include genre details
         },
       },
     },
   });
 
   return filmWithGenres;
 });