import { hasAccess } from "~/server/utils/permission";
export default defineEventHandler(async (event) => {
  hasAccess(event, ['admin', 'author']);
  const cast = await prisma.cast.findMany({
    include: {
      created_by: true,
      film_casts: {
        include: {
          film: true,
        },
      },
    }
  });
  return cast;
});