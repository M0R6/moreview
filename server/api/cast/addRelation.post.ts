export default defineEventHandler(async (event) => {
   const body = await readBody(event)

   await prisma.filmCast.create({
       data: {
           film: { connect: { id: body.film_id } },
           cast: { connect: { id: body.cast_id } },
           character_name: body.character_name,
           created_by: { connect: { id: body.createdBy } },
           created_at: new Date(),
           updated_at: new Date(),
       },
   })

   setResponseStatus(event, 201)
   
   return { message: "Genre created" }
})

