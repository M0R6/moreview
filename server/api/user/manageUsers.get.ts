export default defineEventHandler(async (event) => {

  const user = await prisma.users.findMany();

  return user;
});