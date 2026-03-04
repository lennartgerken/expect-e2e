import withAuth from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/api/auth', '/_next']
const NO_VIEWER_ROUTES = ['/transactions/new']

export default withAuth(
    function proxy(req) {
        const pathname = req.nextUrl.pathname
        const role = req.nextauth.token?.role

        if (
            NO_VIEWER_ROUTES.some((route) => pathname.startsWith(route)) &&
            role === 'VIEWER'
        ) {
            return NextResponse.redirect(new URL('/transactions', req.url))
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized({ token, req }) {
                const pathname = req.nextUrl.pathname
                if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route)))
                    return true

                return !!token
            }
        },
        pages: {
            signIn: '/login'
        }
    }
)
