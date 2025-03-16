import { hasAccess } from '~/server/utils/permission';
export default defineEventHandler(async (event) => {
  hasAccess(event, ['admin', 'author']);
  const { id } = event.context.params || {};
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID parameter is missing',
    });
  }

  const cast = await prisma.filmCast.findMany({
    where: {
      film: {
        id: id,
      }
    },
    include: {
      created_by: true,
      film: true,
      cast: {
        include: {
          created_by: true,
        }
      },
    }
  });

  return cast;
})
