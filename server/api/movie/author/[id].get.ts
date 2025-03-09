import { hasAccess } from "~/server/utils/permission";

export default defineEventHandler(async (event) => {

  hasAccess(event, ['author']);
  
  const { id } = event.context.params || {};

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID parameter is missing',
    });
  }

  try {
    const films = await prisma.film.findMany({
      where: {
        postedBy: id, // Fetch movies created by the user with this ID
      },
      include: {
        genres_relations: {
          include: {
            genre: true, // Include genre details
          },
        },
        createdBy: { // Include the user who created the movie
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // if (!films || films.length === 0) {
    //   throw createError({
    //     statusCode: 404,
    //     statusMessage: 'No movies found for this user',
    //   });
    // }

    return films;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch movies',
    });
  }
});