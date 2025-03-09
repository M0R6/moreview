import { PrismaClient } from '@prisma/client'
import { unlink } from 'fs/promises';
import fs from 'fs'
import path from 'path'
import { hasAccess } from '~/server/utils/permission'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

    hasAccess(event, ['admin'])

    try {
        const { id } = getRouterParams(event)
        if (!id) {
            return { error: 'Invalid genre ID' }
        }

        // Retrieve the movie record to get the file paths
        const user = await prisma.users.findUnique({
            where: { id }
        })

        if (!user) {
            return { error: 'Movie not found' }
        }

        const uploadDir = process.env.ENV_MODE === 'development' ? 'public' : '../../../var/www/moreview/'

        // Construct the full paths to the files
        const userPath = user.photo ? path.join(process.cwd(), uploadDir, user.photo) : null

        // Delete the files from the filesystem
        if (userPath) {
            await unlink(userPath).catch(() => console.warn("Failed to delete old poster"));
            console.log("File deleted successfully!");
        } else {
            console.log("File not found or already deleted:", userPath);
        }

        const updatedUser = await prisma.users.delete({
            where: { id },
        })

        return { message: 'User deleted successfully', updatedUser }
    } catch (error) {
        console.error('Error updating genre:', error)
        return { error: 'Failed to update genre' }
    }
})
