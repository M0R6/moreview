export default defineEventHandler(async (event) => {
   const { id } = event.context.params || {};
   if (!id) {
     throw new Error('ID parameter is missing');
   }
 
   const film = await prisma.film.findUnique({
     where: { id },
     include: {
       genres_relations: {
         include: {
           genre: true,
         },
       },
     },
   });
 
   return film;
 });