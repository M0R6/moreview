export default defineEventHandler(async (event) => {
   const films = await prisma.film.findMany({
     include: {
       genres_relations: {
         include: {
           genre: true,
         },
       },
     },
   });
 
   return films;
 });