export default defineEventHandler(async (event) => {
  const films = await prisma.film.findMany({
    where: {
       archived_at: null,
       typeMov: {
         equals: 'series',
       }
    },
    include: {
      createdBy: true,
      genres_relations: {
        include: {
          genre: true,
        },
      },
      comments: true
    },
    take: 25,
  });

  return films;
});