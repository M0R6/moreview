import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const { id } = getRouterParams(event)
        if (!id) {
            return { error: 'Invalid genre ID' }
        }

        const updatedGenre = await prisma.genre.update({
            where: { id },
            data: { 
                deleted_at: null,
                updated_at: new Date(),
             },
        })

        return { message: 'Genre updated successfully', updatedGenre }
    } catch (error) {
        console.error('Error updating genre:', error)
        return { error: 'Failed to update genre' }
    }
})
