import { hasAccess } from '~/server/utils/permission';

export default defineEventHandler(async (event) => {
  hasAccess(event, ['admin']);

  const user = await prisma.users.findMany();

  return user;
});