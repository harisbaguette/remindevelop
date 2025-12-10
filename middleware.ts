import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 1. Create Supabase Client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // Sync cookies between Request and Response
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 2. Check Auth Session
    // getUser is safer than getSession for middleware as it re-validates the token
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // 3. Define Public and Protected Routes
    const isLoginPage = path.startsWith('/login')
    const isPublicResource = path.includes('.') || path.startsWith('/api') || path.startsWith('/auth')
    // Note: /api currently used for classify, usually requires auth, but middleware might just pass user. 
    // Let's secure /api as well unless specifically public.
    // Actually, allow /api/auth if exists, but /api/classify should probably be protected.
    // For now, let's strictly protect pages. Resources are handled by matcher.

    // 4. Redirect Logic
    // Case A: Unauthenticated User trying to access protected page
    if (!user && !isLoginPage && !path.startsWith('/auth')) {
        // Allow manifest, images, etc (handled by matcher, but double check)
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Case B: Authenticated User trying to access Login page
    if (user && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Public assets
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
