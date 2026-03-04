import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from './auth-options'

export async function getServerUser() {
    const session = await getServerSession(authOptions)
    return session?.user ?? null
}

export async function requireServerUser() {
    const user = await getServerUser()
    if (!user) redirect('/login')

    return user
}
