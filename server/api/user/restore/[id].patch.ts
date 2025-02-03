import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const { id } = getRouterParams(event)
        if (!id) {
            return { error: 'Invalid genre ID' }
        }

        const updatedUsers= await prisma.users.update({
            where: { id },
            data: { 
                deleted_at: null,
                updated_at: new Date(),
             },
        })

        return { message: 'User updated successfully', updatedUsers }
    } catch (error) {
        console.error('Error updating user:', error)
        return { error: 'Failed to update user' }
    }
})
