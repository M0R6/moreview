import { PrismaClient } from '@prisma/client'
import { hasAccess } from '~/server/utils/permission'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    hasAccess(event, ['admin'])
    try {
        const genres = await prisma.genre.findMany()   
        return genres
    } catch (error) {
        console.error("Error fetching genres:", error)
        return { error: "Failed to fetch genres" }
    }
})
