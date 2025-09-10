import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificar variables de entorno
    const mongoUri = process.env.MONGODB_URI;
    const jwtSecret = process.env.JWT_SECRET;
    const nodeEnv = process.env.NODE_ENV;
    
    const envCheck = {
      MONGODB_URI: mongoUri ? 'SET' : 'MISSING',
      JWT_SECRET: jwtSecret ? 'SET' : 'MISSING',
      NODE_ENV: nodeEnv || 'UNDEFINED'
    };

    // Intentar conexión básica a MongoDB
    let mongoStatus = 'NOT_TESTED';
    let mongoError = null;
    
    if (mongoUri) {
      try {
        const { MongoClient } = await import('mongodb');
        const client = new MongoClient(mongoUri);
        await client.connect();
        await client.db('admin').command({ ping: 1 });
        await client.close();
        mongoStatus = 'SUCCESS';
      } catch (error) {
        mongoStatus = 'ERROR';
        mongoError = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    return NextResponse.json({
      status: 'debug_info',
      environment: envCheck,
      mongodb: {
        status: mongoStatus,
        error: mongoError
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}