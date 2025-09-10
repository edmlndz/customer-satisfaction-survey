import { createHmac } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production-make-it-very-long';

export function signJWT(payload: any): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + (24 * 60 * 60) // 24 horas
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
  
  const signature = createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJWT(token: string): any {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    
    if (!encodedHeader || !encodedPayload || !signature) {
      throw new Error('Token inválido');
    }

    // Verificar firma
    const expectedSignature = createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      throw new Error('Firma inválida');
    }

    // Decodificar payload
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());
    
    // Verificar expiración
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token expirado');
    }

    return payload;
  } catch (error) {
    throw new Error('Token inválido');
  }
}