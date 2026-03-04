import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import Nav from '@/components/nav'

export const metadata: Metadata = {
    title: 'expect(e2e)',
    description: ''
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className="p-3 text-gray-700">
                <Providers>
                    <Nav />
                    <main className="max-w-7xl mx-auto">{children}</main>
                </Providers>
            </body>
        </html>
    )
}
