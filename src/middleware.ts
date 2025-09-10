import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  // Solo aplicar middleware a rutas del dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // El middleware no puede acceder a localStorage, así que vamos a deshabilitar
    // la verificación aquí y hacer la verificación en el componente del dashboard
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};