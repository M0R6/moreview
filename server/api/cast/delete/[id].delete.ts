import { unlink } from 'fs/promises';
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { hasAccess } from '~/server/utils/permission'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

    hasAccess(event, ['admin', 'author'])

    try {
        const { id } = getRouterParams(event)
        if (!id) {
            return { error: 'Invalid movie ID' }
        }

        // Retrieve the movie record to get the file paths
        const cast = await prisma.cast.findUnique({
            where: { id }
        })

        if (!cast) {
            return { error: 'Movie not found' }
        }

        const uploadDir = process.env.ENV_MODE === 'development' ? 'public' : '../../../var/www/moreview/'

        // Construct the full paths to the files
        const castPath = cast.photo ? path.join(process.cwd(), uploadDir, cast.photo) : null

        // Delete the files from the filesystem
        if (castPath) {
            await unlink(castPath).catch(() => console.warn("Failed to delete old poster"));
            console.log("File deleted successfully!");
        } else {
            console.log("File not found or already deleted:", castPath);
        }

        // Delete the movie record from the database
        const deletedCast = await prisma.cast.delete({
            where: { id }
        })

        return { message: 'Cast deleted successfully', deletedCast }
    } catch (error) {
        console.error('Error deleting cast:', error)
        return { error: 'Failed to delete cast' }
    }
})
