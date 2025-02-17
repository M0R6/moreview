export default defineEventHandler(async (event) => {
   const films = await prisma.film.findMany({
     include: {
       createdBy: true,
       genres_relations: {
         include: {
           genre: true,
         },
       },
     },
   });

   return films;
 });