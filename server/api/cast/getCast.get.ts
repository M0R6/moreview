export default defineEventHandler(async (event) => {
  const cast = await prisma.cast.findMany({
    include: {
      created_by: true,
    }
  });
  return cast;
});