import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
   const body = await readBody(event)

   const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'casts');
   if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
   }

   let castPath = null

   if (body.photo) {
     const photoFileName = `${uuidv4()}.jpg`; // Adjust the extension as needed
     const photoFilePath = path.join(uploadsDir, photoFileName);
     const base64Data = body.photo.replace(/^data:image\/\w+;base64,/, "");
     const buffer = Buffer.from(base64Data, 'base64');
     await writeFile(photoFilePath, buffer);
     castPath = `/uploads/casts/${photoFileName}`;
     console.log('Poster saved at:', castPath);
   }

   const castExist = await prisma.cast.findFirst({
      where: {
         OR: [
            { name: body.name },
         ]
      }
   })

   if (castExist) {
      throw createError({
         statusCode: 403,
         statusMessage: "cast already exists",
      })
   }

   await prisma.cast.create({
      data: {
         name: body.name,
         photo: castPath,
         created_by: { connect: { id: body.createdBy } },
         created_at: new Date(),
         updated_at: new Date(),
      },
   })

   setResponseStatus(event, 201)

   return { message: "Genre created" }
})