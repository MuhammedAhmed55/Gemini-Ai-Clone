import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export async function updateSession(request: NextRequest) {
  // Prepare a response object that we can mutate with cookies set by Supabase
  let response = NextResponse.next({ request })

  // Create a Supabase client bound to the middleware's request/response cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // When Supabase needs to set or refresh cookies, we need to reflect them on the response
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Get the authenticated user (if any)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { nextUrl } = request
  const pathname = nextUrl.pathname

  // Routes that should be hidden from authenticated users
  const authPages = new Set<string>(['/login', '/signup'])

  // Protected area root(s)
  const requiresAuth = pathname.startsWith('/dashboard')

  // If user is not logged in and tries to access a protected route, redirect to login
  if (!user && requiresAuth) {
    const redirectTo = new URL('/login', nextUrl.origin)
    // preserve intended destination
    redirectTo.searchParams.set('redirect', pathname + nextUrl.search)
    return NextResponse.redirect(redirectTo)
  }

  // If user is logged in and tries to access auth pages, send to dashboard
  if (user && authPages.has(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  // For other public routes or authenticated access, continue with any cookies set
  return response
}