import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const { id } = getRouterParams(event) // Get the genre ID from the URL
        const { title } = await readBody(event) // Get the new title from the request body

        if (!id || !title) {
            return { error: 'Invalid genre ID or title' }
        }

        // Update the genre title and set the updated_at timestamp
        const updatedGenre = await prisma.genre.update({
            where: { id },
            data: { 
                title,
                updated_at: new Date(), // Update the timestamp
            },
        })

        return { message: 'Genre updated successfully', updatedGenre }
    } catch (error) {
        console.error('Error updating genre:', error)
        return { error: 'Failed to update genre' }
    }
})