import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { users } from './users'

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'Fake Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials) return null
                const user = users.find(
                    (u) =>
                        u.username === credentials.username &&
                        u.password === credentials.password
                )
                if (!user) return null

                return {
                    id: user.id,
                    name: user.username,
                    role: user.role
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
        error: '/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = user.role
            return token
        },
        async session({ session, token }) {
            if (session.user) session.user.role = token.role
            return session
        }
    }
}
