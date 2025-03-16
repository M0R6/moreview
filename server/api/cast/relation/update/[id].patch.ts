import { PrismaClient } from '@prisma/client'
import { hasAccess } from '~/server/utils/permission'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    hasAccess(event, ['admin', 'author'])
    try {
        const { id } = getRouterParams(event) // Get the genre ID from the URL
        const body = await readBody(event) // Get the new title from the request body

        if (!id) {
            return { error: 'Invalid Film Cast Relation ID' }
        }

        // Update the genre title and set the updated_at timestamp
        const updatedGenre = await prisma.filmCast.update({
            where: { id },
            data: { 
                character_name: body.character_name,
                updated_at: new Date(), // Update the timestamp
            },
        })

        return { message: 'Cast relation updated successfully', updatedGenre }
    } catch (error) {
        console.error('Error updating cast relation:', error)
        return { error: 'Failed to update cast relation' }
    }
})