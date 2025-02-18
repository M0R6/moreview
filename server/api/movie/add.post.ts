import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate required fields
  if (!body.title || !body.description || !body.release_year || !body.rating || !body.creator) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields (title, description, release_year, duration, rating, creator).',
    });
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  let posterPath = null;
  let trailerPath = null;

  // Save poster file if provided
  if (body.poster) {
    const posterFileName = `${uuidv4()}.jpg`; // Adjust the extension as needed
    const posterFilePath = path.join(uploadsDir, posterFileName);
    const base64Data = body.poster.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    await writeFile(posterFilePath, buffer);
    posterPath = `/uploads/${posterFileName}`;
    console.log('Poster saved at:', posterPath);
  }

  // Save trailer file if provided
  if (body.trailer) {
    const trailerFileName = `${uuidv4()}.mp4`; // Adjust the extension as needed
    const trailerFilePath = path.join(uploadsDir, trailerFileName);
    const base64Data = body.trailer.replace(/^data:video\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    await writeFile(trailerFilePath, buffer);
    trailerPath = `/uploads/${trailerFileName}`;
    console.log('Trailer saved at:', trailerPath);
  }

  // Create the film record
  const film = await prisma.film.create({
    data: {
      title: body.title,
      typeMov: body.movieType,
      description: body.description,
      release_year: parseInt(body.release_year),
      duration: parseInt(body.duration) || null,
      episode: parseInt(body.episode) || null,
      rating: body.rating,
      poster: posterPath,
      trailer: trailerPath,
      trailerUrl: body.trailerUrl,
      creator: body.creator,
      cast: body.castings,
      postedBy: body.postedBy,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // Add genre relations if genreIds are provided
  if (body.genreIds && body.genreIds.length > 0) {
    await prisma.genreRelation.createMany({
      data: body.genreIds.map((genreId: string) => ({
        film_id: film.id,
        genre_id: genreId,
        created_at: new Date(),
        updated_at: new Date(),
      })),
    });
  }

  // Fetch the film with its genres and castings
  const filmWithRelations = await prisma.film.findUnique({
    where: { id: film.id },
    include: {
      genres_relations: {
        include: {
          genre: true,
        },
      },
    },
  });

  return filmWithRelations;
});