import { PrismaClient } from '@prisma/client'
import { hasAccess } from '~/server/utils/permission'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    hasAccess(event, ['admin', 'author', 'subs']) // Check if the user has the required permissions
    try {
        const { id } = getRouterParams(event) // Get the genre ID from the URL
        const body = await readBody(event) // Get the new title from the request body

        if (!id) {
            return { error: 'Invalid genre ID or title' }
        }

        // Update the genre title and set the updated_at timestamp
        const updatedGenre = await prisma.comment.update({
            where: { id },
            data: { 
                comment: body.comment,
                rating: body.rating,
                updated_at: new Date(), // Update the timestamp
            },
        })

        return { message: 'Review updated successfully', updatedGenre }
    } catch (error) {
        console.error('Error updating your review:', error)
        return { error: 'Failed to update your review' }
    }
})