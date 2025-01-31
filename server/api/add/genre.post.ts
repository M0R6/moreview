export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const genreExists = await prisma.genre.findFirst({
        where: { 
            OR: [
                { title: body.title },
            ]
        }
    })

    if(genreExists) {
        throw createError({
            statusCode: 403,
            statusMessage: "Genre already exists",
        })
    }

    await prisma.genre.create({
        data: {
            title: body.title,
            created_at: new Date(),
            updated_at: new Date(),
        },
    })

    setResponseStatus(event, 201)
    
    return { message: "Genre created" }
})

