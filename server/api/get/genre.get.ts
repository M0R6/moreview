import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
    try {
        const genres = await prisma.genre.findMany()
        return genres
    } catch (error) {
        console.error("Error fetching genres:", error)
        return { error: "Failed to fetch genres" }
    }
})
