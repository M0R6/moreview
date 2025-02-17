export default defineEventHandler(async (event) => {
  const cast = await prisma.casting.findMany({
    include: {
      casting_relations: {
         include: {
            casting: true,
         },
      }
    },
  });

  return cast;
});