import NextAuth, { DefaultSession } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module 'next-auth' {
    interface User {
        username: string
    }
    interface Session {
        user: User & {
            username: string
            role: string
        }
        token: {
            username: string
            role: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role: string,
    }
}