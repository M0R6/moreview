import { hasAccess } from "~/server/utils/permission";
export default defineEventHandler(async (event) => {
  hasAccess(event, ['admin', 'author']);
  const cast = await prisma.comment.findMany({
    include: {
      user: true,
      film: true
    }
  });
  return cast;
});