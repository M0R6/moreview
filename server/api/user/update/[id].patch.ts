import { PrismaClient } from '@prisma/client'
import { hash } from "bcrypt"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const { id } = getRouterParams(event) // Get the user ID from the URL
        const body = await readBody(event) // Get the request body

        if (!id) {
            return { error: 'Invalid user ID' }
        }

        // Prepare the data to update
        const updateData: any = {
            name: body.name,
            email: body.email,
            role: body.role,
            updated_at: new Date(), // Update the timestamp
        }

        // Only hash and update the password if it's provided
        if (body.password) {
            updateData.password = await hash(body.password, 12)
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