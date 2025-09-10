import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/jwt';

// Credenciales por defecto (en producción usar base de datos)
const DEFAULT_CREDENTIALS = {
  email: 'admin@empresa.com',
  password: 'admin123'
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt:', { email, password });
    console.log('Expected:', DEFAULT_CREDENTIALS);

    // Validar que se enviaron email y password
    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Verificar credenciales (en producción usar hash y base de datos)
    if (email !== DEFAULT_CREDENTIALS.email || password !== DEFAULT_CREDENTIALS.password) {
      console.log('Invalid credentials');
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generar JWT token
    console.log('Generating token...');
    const token = signJWT({ email: email, role: 'admin' });
    console.log('Token generated:', token.substring(0, 50) + '...');

    return NextResponse.json({
      message: 'Login exitoso',
      token: token,
      user: {
        email: email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}