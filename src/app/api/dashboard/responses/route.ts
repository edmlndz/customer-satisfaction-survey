import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import clientPromise from '@/lib/mongodb';

// Marcar como dinámica para evitar el error de renderizado estático
export const dynamic = 'force-dynamic';

async function verifyToken(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token no proporcionado');
  }

  const token = authHeader.substring(7);
  
  try {
    const payload = verifyJWT(token);
    return payload;
  } catch (error) {
    throw new Error('Token inválido');
  }
}

export async function GET(request: Request) {
  try {
    // Verificar token
    await verifyToken(request);

    // Conectar a MongoDB
    const client = await clientPromise;
    const db = client.db('customer-satisfaction-survey');
    const collection = db.collection('responses');

    // Obtener todas las respuestas ordenadas por fecha
    const responses = await collection.find({}).sort({ submittedAt: -1 }).toArray();
    const totalResponses = await collection.countDocuments();

    // Calcular estadísticas
    const stats = {
      totalResponses,
      averageRatings: {
        overall_satisfaction: 0,
        service_quality: 0,
        staff_friendliness: 0
      },
      recommendationDistribution: {
        'Definitivamente sí': 0,
        'Probablemente sí': 0,
        'Tal vez': 0,
        'Probablemente no': 0,
        'Definitivamente no': 0
      }
    };

    if (responses.length > 0) {
      // Calcular promedios de ratings
      let totalOverall = 0;
      let totalService = 0;
      let totalStaff = 0;

      responses.forEach(response => {
        if (response.responses) {
          totalOverall += response.responses.overall_satisfaction || 0;
          totalService += response.responses.service_quality || 0;
          totalStaff += response.responses.staff_friendliness || 0;
          
          // Contar recomendaciones
          const recommendation = response.responses.recommendation;
          if (recommendation && stats.recommendationDistribution.hasOwnProperty(recommendation)) {
            stats.recommendationDistribution[recommendation as keyof typeof stats.recommendationDistribution]++;
          }
        }
      });

      stats.averageRatings.overall_satisfaction = Math.round((totalOverall / responses.length) * 100) / 100;
      stats.averageRatings.service_quality = Math.round((totalService / responses.length) * 100) / 100;
      stats.averageRatings.staff_friendliness = Math.round((totalStaff / responses.length) * 100) / 100;
    }

    return NextResponse.json({
      success: true,
      data: {
        responses: responses.map(response => ({
          ...response,
          _id: response._id.toString()
        })),
        stats
      }
    });

  } catch (error) {
    console.error('Error al obtener respuestas:', error);
    
    if (error instanceof Error && error.message.includes('Token')) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}