'use client'

import { useSession, signOut } from 'next-auth/react'

export default function Nav() {
    const { data: session } = useSession()

    return (
        <nav className="flex justify-between items-center mb-3">
            <div className="text-4xl">
                <span className="font-bold">expect</span>(e2e)
            </div>
            {session && (
                <div className="flex items-center gap-3">
                    <div className="text-xl">
                        {session.user.name ?? session.user.email}
                    </div>
                    <button onClick={() => signOut({ callbackUrl: '/' })}>
                        Logout
                    </button>
                </div>
            )}
        </nav>
    )
}
