import { Title } from "#components";

export default defineEventHandler(async (event) => {
  let { id } = event.context.params || {};
  id = decodeURIComponent(id);
  if (!id) {
    throw new Error('ID parameter is missing');
  }

  // Normalisasi input pengguna
  const normalizedId = id.replace(/\s/g, ''); // Hapus semua spasi

  // Buat berbagai kemungkinan variasi pencarian
  const searchTerms = [
    id,                       // Input asli
    id.replace(/ /g, '-'),    // Spasi → Strip
    id.replace(/-/g, ' '),    // Strip → Spasi
    normalizedId,             // Tanpa spasi sama sekali
    id.split('').join(' '),   // Setiap karakter dipisah dengan spasi
  ];

  const film = await prisma.film.findMany({
    where: { 
      archived_at: null,
      OR: [
        // Search in film title
        ...searchTerms.map(term => ({
          title: {
            contains: term,
            // mode: 'insensitive', // Optional: makes the search case-insensitive
          },
        })),
        // Search in cast
        {
          cast: {
            contains: id, // Check if cast contains id
            // mode: 'insensitive', // Optional: makes the search case-insensitive
          },
        },
        {
          creator: {
            contains: id, // Check if creator contains id
          }
        },
        // Search in genre title
        {
          genres_relations: {
            some: {
              genre: {
                title: {
                  contains: id, // Check if genre title contains id
                  // mode: 'insensitive', // Optional: makes the search case-insensitive
                },
              },
            },
          },
        },
      ],
    },
    include: {
      createdBy: true,
      genres_relations: {
        include: {
          genre: true,
        },
      },
    },
    take: 10, // Optional: limits the number of results
  });

  if (!film || film.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No movies found',
    });
  }

  return film;
});