'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useId, useState } from 'react'

export default function LoginPage() {
    const usernameID = useId()
    const passwordID = useId()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const error = useSearchParams().get('error')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await signIn('credentials', {
            username,
            password,
            callbackUrl: '/transactions'
        })
    }

    return (
        <div className="flex justify-center">
            <div className="max-w-md border border-gray-300 rounded p-4">
                <h1>Login</h1>
                <form className="" onSubmit={handleSubmit}>
                    {error === 'CredentialsSignin' && (
                        <div className="bg-red-800 mb-4 p-2 text-white">
                            Username or password incorrect.
                        </div>
                    )}
                    <label htmlFor={usernameID}>Username</label>
                    <input
                        name="username"
                        value={username}
                        id={usernameID}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor={passwordID}>Password</label>
                    <input
                        id={passwordID}
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}
