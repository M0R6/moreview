import { hasAccess } from "~/server/utils/permission";

export default defineEventHandler(async (event) => {

  hasAccess(event, ['admin', 'author']);
  
  const films = await prisma.film.findMany({
    include: {
      createdBy: true,
      genres_relations: {
        include: {
          genre: true,
        },
      },
      comments: true
    },
  });

  return films;
});