import { hash } from "bcrypt"

export default defineEventHandler(async (event) => {

    hasAccess(event, ['admin'])

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
            name: body.name,
            email: body.email,
            notlp: body.notlp,
            password: await hash(body.password, 12),
            role: body.role || 'subs', // Assuming a default role of 'user'
            isActive: true, // Assuming new users are active by default
            created_at: new Date(),
            updated_at: new Date(),
        },
    })

    setResponseStatus(event, 201)
    
    return { message: "User created" }
})

