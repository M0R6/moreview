import { hash } from "bcrypt"
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const uploadBaseDir = process.env.ENV_MODE === 'development' ? 'public/uploads' :'/var/www/moreview/uploads';

    const uploadsDir = path.join(uploadBaseDir, 'profile');
    if (!existsSync(uploadsDir)) {
       await mkdir(uploadsDir, { recursive: true });
    }

    let profilePath = null

    if (body.photo) {
      const photoFileName = `${uuidv4()}.jpg`; // Adjust the extension as needed
      const photoFilePath = path.join(uploadsDir, photoFileName);
      const base64Data = body.photo.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      await writeFile(photoFilePath, buffer);
      profilePath = `/uploads/profile/${photoFileName}`;
      console.log('Poster saved at:', profilePath);
    }

    const userExists = await prisma.users.findFirst({
        where: { 
            OR: [
                { email: body.email },
            ]
        }
    })

    if(userExists) {
        throw createError({
            statusCode: 403,
            statusMessage: "User already exists",
        })
    }

    await prisma.users.create({
        data: {
            email: body.email.toLowerCase(),
            notlp: body.notlp,
            name: body.name,
            password: await hash(body.password, 12),
            photo: profilePath,
            role: "subs", 
            created_at: new Date(),
            updated_at: new Date(),
            isActive: true,
        },
    })

    setResponseStatus(event, 201)
    
    return { message: "User created" }
})

