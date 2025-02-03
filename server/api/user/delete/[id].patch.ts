import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const { id } = getRouterParams(event)
        if (!id) {
            return { error: 'Invalid genre ID' }
        }

        const updatedUser = await prisma.users.update({
            where: { id },
            data: { 
                deleted_at: new Date(),
                updated_at: new Date(),
                isActive: false,
             },
        })

        return { message: 'Genre updated successfully', updatedUser }
    } catch (error) {
        console.error('Error updating genre:', error)
        return { error: 'Failed to update genre' }
    }
})
