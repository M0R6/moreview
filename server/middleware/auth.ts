import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  // Get session
  const session = await getServerSession(event)

  // If no session, set auth context to null
  event.context.auth = session
    ? { isAuthenticated: true, user: session.user }
    : { isAuthenticated: false, user: null }
})
