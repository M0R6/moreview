import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import { compare } from "bcrypt"

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/error.vue',
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
     
      async authorize (credentials: any) {

        const user = await prisma.users.findUnique({
          where: {
            email: credentials?.email,
          },
        })

        if(!user) {
          throw createError({
            statusCode: 403,
            statusMessage: "Credentials not working",
          })

        }

        const userDeleted = user.deleted_at !== null

        if (userDeleted) {
          throw createError({
            statusCode: 403,
            statusMessage: "Credentials not working (User deleted)",
          })

        }

        const isPasswordValid = await compare(credentials?.password, user.password)

        if (!isPasswordValid) {
          throw createError({
            statusCode: 403,
            statusMessage: "Credentials not working",
          })

        }

        const UserActive = user.isActive === true

        if (!UserActive) {
          throw createError({
            statusCode: 403,
            statusMessage: "This user has been deactivated, please contact the admin",
          })

        }

        return user
      }
    })
  ],
  callbacks: {
    // Specify here the payload of your token and session
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) { 
        token.id = user.id
        token.nombre = user.name
        token.email = user.email
        token.role = user.role;
      }
      return token
    },
    async session({ session, token }: { session: any, token: any }) {
      session.user.id = token.id
      session.user.nombre = token.name
      session.user.email = token.email
      session.user.role = token.role;
      return session
    },
  },
})