import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth0 } from './lib/auth0';

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request);

  if (request.nextUrl.pathname.startsWith('/auth')) {
    return authRes;
  }

  if (request.nextUrl.pathname.startsWith('/api/healthz')) {
    return authRes;
  }

  const session = await auth0.getSession(request);

  if (!session) {
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  return authRes;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
