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
        const film = await prisma.film.findUnique({
            where: { id }
        })

        if (!film) {
            return { error: 'Movie not found' }
        }

        // Construct the full paths to the files
        const trailerPath = film.trailer ? path.join(process.cwd(), 'public', film.trailer) : null
        const posterPath = film.poster ? path.join(process.cwd(), 'public', film.poster) : null

        // Delete the files from the filesystem
        if (trailerPath && fs.existsSync(trailerPath)) {
            fs.unlinkSync(trailerPath)
        }

        if (posterPath && fs.existsSync(posterPath)) {
            fs.unlinkSync(posterPath)
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