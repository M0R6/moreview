import { PrismaClient } from '@prisma/client'
import { hasAccess } from '~/server/utils/permission'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    hasAccess(event, ['admin'])
    try {
        const { id } = getRouterParams(event)
        if (!id) {
            return { error: 'Invalid user ID' }
        }

        const updatedUser= await prisma.users.update({
            where: { id },
            data: { 
                isActive: false,
                updated_at: new Date(),
             },
        })

        return { message: 'User has banned successfully', updatedUser }
    } catch (error) {
        console.error('Error to ban this user:', error)
        return { error: 'Failed to ban this user' }
    }
})
