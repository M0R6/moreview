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
        const film = await prisma.film.findUnique({
            where: { id }
        })

        if (!film) {
            return { error: 'Movie not found' }
        }

        const uploadDir = process.env.ENV_MODE === 'development' ? 'public' : '../../../var/www/moreview'

        // Construct the full paths to the files
        const trailerPath = film.trailer ? path.join(process.cwd(), uploadDir, film.trailer) : null
        const posterPath = film.poster ? path.join(process.cwd(), uploadDir, film.poster) : null

        // Delete the files from the filesystem
        if (trailerPath && fs.existsSync(trailerPath)) {
            await fs.promises.unlink(trailerPath);
        }

        if (posterPath && fs.existsSync(posterPath)) {
            await fs.promises.unlink(posterPath);
        }

        // Delete the movie record from the database
        const deletedFilm = await prisma.film.delete({
            where: { id }
        })

        return { message: 'Movie deleted successfully', deletedFilm }
    } catch (error) {
        console.error('Error deleting movie:', error)
        return { error: 'Failed to delete movie' }
    }
})
