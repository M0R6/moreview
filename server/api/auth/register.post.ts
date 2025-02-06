import { hash } from "bcrypt"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const userExists = await prisma.users.findFirst({
        where: { 
            OR: [
                { email: body.email },
            ]
        }
    })

    if(userExists) {
        throw createError({
            statusCode: 403,
            statusMessage: "User already exists",
        })
    }

    await prisma.users.create({
        data: {
            email: body.email.toLowerCase(),
            name: body.name,
            password: await hash(body.password, 12),
            role: "subs", 
            created_at: new Date(),
            updated_at: new Date(),
            isActive: true,
        },
    })

    setResponseStatus(event, 201)
    
    return { message: "User created" }
})

