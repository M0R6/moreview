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
    const cast = await prisma.cast.findMany({
      where: {
        OR: [
          { createdBy: id },
          {
            film_casts: {
              some: {
                film: {
                  postedBy: id,
                },
              },
            },
          },
        ],
      },
      include: {
        created_by: true,
        film_casts: {
          include: {
            film: true,
          },
        },
      },
    });

    return cast;
  } catch (error) {
    console.error('Error fetching casts:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch casts',
    });
  }
});