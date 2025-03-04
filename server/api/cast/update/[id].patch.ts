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

  const uploadBaseDir = process.env.ENV_MODE === 'development' ? 'public/uploads' :'/var/www/moreview/uploads';

  const uploadsDir = path.join(uploadBaseDir, 'casts');
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }
 
  let photoPath = null;

  // Fetch the current film data
  const currentCast = await prisma.cast.findUnique({
    where: { id },
  });

  // Update the film
  if (!currentCast) {
    throw new Error("Cast not found");
  }
 
  // Save poster file if provided and delete the old one
  if (body.photo) {
    if (currentCast.photo) {
      const oldPhotoPath = path.join(uploadsDir, path.basename(currentCast.photo));
      await unlink(oldPhotoPath).catch(() => console.warn("Failed to delete old poster"));
    }
    const photoFileName = `${uuidv4()}.jpg`; // Adjust the extension as needed
    const photoFilePath = path.join(uploadsDir, photoFileName);
    const base64Data = body.photo.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    await writeFile(photoFilePath, buffer);
    photoPath = `/uploads/casts/${photoFileName}`;
    console.log('Poster saved at:', photoPath);
  }

  const updatedCast = await prisma.cast.update({
    where: { id },
    data: {
     name: body.name,
     photo: photoPath !== null ? photoPath : currentCast.poster,
     updated_at: new Date(),
    },
  });

  return { message: "Cast updated successfully", updatedCast };
 });