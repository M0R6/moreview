import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  let { id } = event.context.params || {};
  if (!id) {
    throw new Error('ID parameter is missing');
  }

  const film = await prisma.film.findFirst({
    where: {
      id: id,
      typeMov: 'movie', // Additional condition
    },
    include: {
      createdBy: true,
      genres_relations: {
        include: {
          genre: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
      film_casts: {
        include: {
          cast: true,
        },
      }
    },
  });

  return film;
});