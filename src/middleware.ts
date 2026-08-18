import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_SLUG = '/ops-console-7f2q';

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' http://localhost:* https://*.supabase.co https://newmeera-backend.onrender.com https://*.onrender.com https://*.vercel.app;"
  );
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Stealth Admin Protection Wall for /ops-console-7f2q
  if (pathname.startsWith(ADMIN_SLUG)) {
    let response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');

    // Allow logged-out access ONLY to the admin login page
    if (pathname === `${ADMIN_SLUG}/login`) {
      return applySecurityHeaders(response);
    }

    // Initialize Supabase Server Client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wgfbhkqitfhzzsxtengm.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_cxQXstlFHLsNTOe5PWj_5g_jo464Z7x',
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    let {
      data: { user },
    } = await supabase.auth.getUser();

    // If session cookie was not attached yet, check auth_token cookie
    if (!user) {
      const authToken = request.cookies.get('auth_token')?.value;
      if (authToken) {
        const { data: tokenUserData } = await supabase.auth.getUser(authToken);
        if (tokenUserData?.user) {
          user = tokenUserData.user;
        }
      }
    }

    // Stealth Wall Check: Must be logged in AND have admin role
    let isAuthorizedAdmin = false;

    if (user) {
      if (user.user_metadata?.role === 'admin') {
        isAuthorizedAdmin = true;
      } else {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (serviceRoleKey) {
          const adminClient = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wgfbhkqitfhzzsxtengm.supabase.co',
            serviceRoleKey,
            { cookies: { getAll: () => [], setAll: () => {} } }
          );
          const { data: adminUser } = await adminClient
            .from('admin_users')
            .select('id, is_active')
            .eq('id', user.id)
            .eq('is_active', true)
            .single();

          if (adminUser && adminUser.is_active) {
            isAuthorizedAdmin = true;
          }
        }
      }
    }

    // IF AUTHENTICATION OR ADMIN CHECK FAILS -> RETURN 404 NOT FOUND PAGE
    if (!isAuthorizedAdmin) {
      const notFoundUrl = new URL('/not-found', request.url);
      const rewriteRes = NextResponse.rewrite(notFoundUrl, { status: 404 });
      rewriteRes.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return applySecurityHeaders(rewriteRes);
    }

    return applySecurityHeaders(response);
  }

  // 2. Customer Account Protection Wall for /account
  if (
    pathname.startsWith('/account') &&
    !pathname.startsWith('/account/login') &&
    !pathname.startsWith('/account/signup')
  ) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wgfbhkqitfhzzsxtengm.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_cxQXstlFHLsNTOe5PWj_5g_jo464Z7x',
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    let {
      data: { user },
    } = await supabase.auth.getUser();

    const authExpiryCookie = request.cookies.get('auth_expiry')?.value;
    const is15DaysExpired = authExpiryCookie ? Date.now() > Number(authExpiryCookie) : false;

    if (is15DaysExpired) {
      user = null;
    } else if (!user) {
      const authToken = request.cookies.get('auth_token')?.value;
      if (authToken) {
        const { data: tokenUserData } = await supabase.auth.getUser(authToken);
        if (tokenUserData?.user) {
          user = tokenUserData.user;
        }
      }
    }

    if (!user) {
      const loginUrl = new URL('/account/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const redirectRes = NextResponse.redirect(loginUrl);
      redirectRes.cookies.delete('auth_token');
      redirectRes.cookies.delete('auth_expiry');
      return applySecurityHeaders(redirectRes);
    }

    return applySecurityHeaders(response);
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/ops-console-7f2q/:path*', '/account/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
