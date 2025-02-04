// server/api/films.post.ts
export default defineEventHandler(async (event) => {
   const body = await readBody(event);
 
   // Create the film
   const film = await prisma.film.create({
     data: {
       title: body.title,
       description: body.description,
       poster: 'https://via.placeholder.com/150',
       release_year: body.release_year,
       duration: body.duration,
       rating: body.rating,
       creator: body.creator,
       trailer: body.trailer,
       created_at: new Date(),
       updated_at: new Date(),
     },
   });
 
   // Create genre relations
   if (body.genreIds && body.genreIds.length > 0) {
     await prisma.genreRelation.createMany({
       data: body.genreIds.map((genreId: string) => ({
         film_id: film.id,
         genre_id: genreId,
         created_at: new Date(),
         updated_at: new Date(),
       })),
     });
   }
 
   // Fetch the film with its genre relations
   const filmWithGenres = await prisma.film.findUnique({
     where: { id: film.id },
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