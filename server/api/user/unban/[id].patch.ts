import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const { id } = getRouterParams(event)
        if (!id) {
            return { error: 'Invalid user ID' }
        }

        const updatedUser= await prisma.users.update({
            where: { id },
            data: { 
                isActive: true,
                updated_at: new Date(),
             },
        })

        return { message: 'User has banned successfully', updatedUser }
    } catch (error) {
        console.error('Error to ban this user:', error)
        return { error: 'Failed to ban this user' }
    }
})
