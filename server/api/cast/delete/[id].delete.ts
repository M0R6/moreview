import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
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

        const uploadDir = process.env.ENV_MODE === 'development' ? 'public' : 'var/www/moreview'

        // Construct the full paths to the files
        const castPath = cast.photo ? path.join(process.cwd(), uploadDir, cast.photo) : null

        // Delete the files from the filesystem
        if (castPath && fs.existsSync(castPath)) {
            await fs.promises.unlink(castPath);
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