import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const { id } = getRouterParams(event)
        if (!id) {
            return { error: 'Invalid movie ID' }
        }

        const updatedFilm = await prisma.film.update({
            where: { id },
            data: { 
                archived_at: new Date(),
                updated_at: new Date(),
             },
        })

        return { message: 'Movie deleted successfully', updatedFilm }
    } catch (error) {
        console.error('Error deleting movie:', error)
        return { error: 'Failed to delete movie' }
    }
})
