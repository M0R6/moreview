import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

import { hasAccess } from '~/server/utils/permission'

export default defineEventHandler(async (event) => {

    hasAccess(event, ['admin', 'author'])

    try {
        const { id } = getRouterParams(event)
        if (!id) {
            return { error: 'Invalid movie ID' }
        }

        const updatedGenre = await prisma.film.update({
            where: { id },
            data: { 
                archived_at: null,
                updated_at: new Date(),
             },
        })

        return { message: 'Movie restored successfully', updatedGenre }
    } catch (error) {
        console.error('Error restoring movie:', error)
        return { error: 'Failed to restore movie' }
    }
})
