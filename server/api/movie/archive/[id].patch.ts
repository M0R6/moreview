import { PrismaClient } from '@prisma/client'
import { hasAccess } from '~/server/utils/permission'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

    hasAccess(event, ['admin', 'author'])
    
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
