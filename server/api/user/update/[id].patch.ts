import { PrismaClient } from '@prisma/client'
import { hash } from "bcrypt"
import { hasAccess } from '~/server/utils/permission'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    hasAccess(event, ['admin', 'subs', 'author'])
    try {
        const { id } = getRouterParams(event) // Get the user ID from the URL
        const body = await readBody(event) // Get the request body
        const userExists = await prisma.users.findFirst({
            where: {
                email: body.email,
            }
        })

        if (userExists && userExists.id !== id) {
            setResponseStatus(event, 409)
            return { error: 'Email is in used by another user' }
        }  

        if (!id) {
            return { error: 'Invalid user ID' }
        }

        const updateData: any = {
            name: body.name,
            email: body.email,
            updated_at: new Date(), 
        }

        // Only hash and update the password if it's provided
        if (body.password) {
            updateData.password = await hash(body.password, 12)
        }

        if (body.role) {
            updateData.role = body.role
        }

        // Update the user
        const updatedUser = await prisma.users.update({
            where: { id },
            data: updateData,
        })

        return { message: 'User updated successfully', updatedUser }
    } catch (error) {
        console.error('Error updating user:', error)
        return { error: 'Failed to update user' }
    }
})