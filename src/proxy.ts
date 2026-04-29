import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function proxy(request: NextRequest) {
  const token = request.cookies.get('at_token')?.value;
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';

  if (pathname.startsWith('/admin')) {
    if (!token && !isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    if (token && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ['/admin/:path*'],
};
