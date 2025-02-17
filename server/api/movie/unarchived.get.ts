export default defineEventHandler(async (event) => {
   const films = await prisma.film.findMany({
     where: {
        archived_at: null,
     },
     include: {
       createdBy: true,
       genres_relations: {
         include: {
           genre: true,
         },
       },
     },
     take: 25,
   });

   return films;
 });