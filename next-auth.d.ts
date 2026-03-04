// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'
import type { DefaultSession } from 'next-auth'
import { Role } from './lib/users'

declare module 'next-auth' {
    interface Session {
        user: {
            role: Role
        } & DefaultSession['user']
    }
    interface User {
        role: Role
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role: Role
    }
}
