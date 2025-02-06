export default defineEventHandler(async (event) => {
   const { id } = event.context.params || {};
   if (!id) {
     throw new Error('ID parameter is missing');
   }
 
   const film = await prisma.users.findUnique({
     where: { id }
   });
 
   return film;
 });