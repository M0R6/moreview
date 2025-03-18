import { PrismaClient } from '@prisma/client'
import { hash } from "bcrypt"
import { hasAccess } from '~/server/utils/permission'
const prisma = new PrismaClient()
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
    hasAccess(event, ['admin', 'subs', 'author'])
    try {
        const { id } = getRouterParams(event) // Get the user ID from the URL
        const body = await readBody(event) // Get the request body
        const userExists = await prisma.users.findFirst({
            where: {
                email: body.email,
            }
        })

        if (userExists && userExists.id !== id) {
            setResponseStatus(event, 409)
            return { error: 'Email is in used by another user' }
        }  

        if (!id) {
            return { error: 'Invalid user ID' }
        }

        if(!userExists) {
            return { error: 'User not found' }
        }


        const uploadBaseDir = process.env.ENV_MODE === 'development' ? 'public/uploads' :'/var/www/moreview/uploads';
    
        const uploadsDir = path.join(uploadBaseDir, 'profile');
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true });
        }
        
        let photoPath = null;

        // Save poster file if provided and delete the old one
        if (body.photo) {
          if (userExists.photo) {
            const oldPhotoPath = path.join(uploadsDir, path.basename(userExists.photo));
            await unlink(oldPhotoPath).catch(() => console.warn("Failed to delete old poster"));
          }
          const photoFileName = `${uuidv4()}.jpg`; // Adjust the extension as needed
          const photoFilePath = path.join(uploadsDir, photoFileName);
          const base64Data = body.photo.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, 'base64');
          await writeFile(photoFilePath, buffer);
          photoPath = `/uploads/profile/${photoFileName}`;
          console.log('Poster saved at:', photoPath);
        }

        const updateData: any = {
            name: body.name,
            email: body.email,
            updated_at: new Date(), 
            photo: photoPath !== null ? photoPath : userExists.photo,
        }

        // Only hash and update the password if it's provided
        if (body.password) {
            updateData.password = await hash(body.password, 12)
        }

        if (body.role) {
            updateData.role = body.role
        }

        // Update the user
        const updatedUser = await prisma.users.update({
            where: { id },
            data: updateData,
        })

        return { message: 'User updated successfully', updatedUser }
    } catch (error) {
        console.error('Error updating user:', error)
        return { error: 'Failed to update user' }
    }
})