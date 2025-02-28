import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  const { params } = event.context;
  if (!params || !params.id) {
    throw new Error("Missing film ID");
  }
  const { id } = params;
  const body = await readBody(event);

  const trailersDir = path.join(process.cwd(), 'public', 'uploads', 'trailers');
  if (!existsSync(trailersDir)) {
    await mkdir(trailersDir, { recursive: true });
  }

  const postersDir = path.join(process.cwd(), 'public', 'uploads', 'posters');
  if (!existsSync(postersDir)) {
    await mkdir(postersDir, { recursive: true });
  }
 
  let posterPath = null;
  let trailerPath = null;

  // Fetch the current film data
  const currentFilm = await prisma.film.findUnique({
    where: { id },
  });

  // Update the film
  if (!currentFilm) {
    throw new Error("Film not found");
  }
 
  // Save poster file if provided and delete the old one
  if (body.poster) {
    if (currentFilm.poster) {
      const oldPosterPath = path.join(postersDir, path.basename(currentFilm.poster));
      await unlink(oldPosterPath).catch(() => console.warn("Failed to delete old poster"));
    }
    const posterFileName = `${uuidv4()}.jpg`; // Adjust the extension as needed
    const posterFilePath = path.join(postersDir, posterFileName);
    const base64Data = body.poster.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    await writeFile(posterFilePath, buffer);
    posterPath = `/uploads/posters/${posterFileName}`;
    console.log('Poster saved at:', posterPath);
  }
 
  // Save trailer file if provided and delete the old one
  if (body.trailer) {
    if (currentFilm.trailer) {
      const oldTrailerPath = path.join(trailersDir, path.basename(currentFilm.trailer));
      await unlink(oldTrailerPath).catch(() => console.warn("Failed to delete old trailer"));
    }
    const trailerFileName = `${uuidv4()}.mp4`; // Adjust the extension as needed
    const trailerFilePath = path.join(trailersDir, trailerFileName);
    const base64Data = body.trailer.replace(/^data:video\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    await writeFile(trailerFilePath, buffer);
    trailerPath = `/uploads/trailers/${trailerFileName}`;
    console.log('Trailer saved at:', trailerPath);
  }

  const updatedFilm = await prisma.film.update({
    where: { id },
    data: {
     title: body.title,
     description: body.description,
     typeMov: body.typeMov,
     poster: posterPath !== null ? posterPath : currentFilm.poster,
     release_year: parseInt(body.release_year),
     duration: parseInt(body.duration) || null,
     episode: parseInt(body.episode) || null,
     rating: body.rating,
     creator: body.creator,
     trailer: trailerPath !== null ? trailerPath : currentFilm.trailer,
     trailerUrl: body.trailerUrl,
     updated_at: new Date(),
    },
  });
 
  // Update genre relations
  if (body.genreIds && body.genreIds.length > 0) {
    // Delete existing genre relations
    await prisma.genreRelation.deleteMany({
     where: { film_id: id },
    });
 
    // Create new genre relations
    await prisma.genreRelation.createMany({
     data: body.genreIds.map((genreId: string) => ({
      film_id: id,
      genre_id: genreId,
      created_at: new Date(),
      updated_at: new Date(),
     })),
    });
  } else {
    // If no genreIds are provided, delete all genre relations for the film
    await prisma.genreRelation.deleteMany({
      where: { film_id: id },
    });
  }
 
  // Fetch the updated film with its genre relations
  const filmWithGenres = await prisma.film.findUnique({
    where: { id },
    include: {
     genres_relations: {
      include: {
        genre: true, // Include genre details
      },
     },
    },
  });
 
  return filmWithGenres;
 });