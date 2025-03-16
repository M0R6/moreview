import { hasAccess } from "~/server/utils/permission"
export default defineEventHandler(async (event) => {
  hasAccess(event, ['admin', 'author', 'subs'])

  const body = await readBody(event)

  const commented = await prisma.comment.findFirst({
    where: {
      user_id: body.user_id,
      film_id: body.film_id
    }
  })

  if (commented) {
    throw createError({
      statusCode: 403,
      statusMessage: "You can't make review twice on the same movie",
    })
  }

  if (body.rating < 0 || body.rating > 5) {
    throw createError({
      statusCode: 403,
      statusMessage: "Allowed value is 1 to 5",
    })
  }

  if (!body.rating) {
    throw createError({
      statusCode: 403,
      statusMessage: "Rating is required",
    })
  }

  await prisma.comment.create({
    data: {
      user_id: body.user_id,
      film_id: body.film_id,
      comment: body.comment,
      rating: body.rating,
      created_at: new Date(),
      updated_at: new Date(),
    },
  })

  setResponseStatus(event, 201)

  return { message: "Genre created" }
})
