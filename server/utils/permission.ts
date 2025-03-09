import { H3Event } from 'h3'

export function hasAccess(event: H3Event, allowedRoles: string[]) {
  const user = event.context.auth?.user

  if (!user || !user.role) {
    throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 })
  }

  if (!allowedRoles.includes(user.role)) {
    throw createError({ statusMessage: 'Forbidden', statusCode: 403 })
  }
}
