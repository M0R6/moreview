import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const { id } = getRouterParams(event)
        if (!id) {
            return { error: 'Invalid movie ID' }
        }

        const updatedGenre = await prisma.film.update({
            where: { id },
            data: { 
                deleted_at: null,
                updated_at: new Date(),
             },
        })

        return { message: 'Movie restored successfully', updatedGenre }
    } catch (error) {
        console.error('Error restoring movie:', error)
        return { error: 'Failed to restore movie' }
    }
})
