import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
    try {
        const user = await prisma.users.findMany()   
        return user
    } catch (error) {
        console.error("Error fetching genres:", error)
        return { error: "Failed to fetch genres" }
    }
})
