import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { responses } = body;

    if (!responses || Object.keys(responses).length === 0) {
      return NextResponse.json(
        { error: 'Las respuestas son requeridas' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('customer-satisfaction-survey');
    const collection = db.collection('responses');

    const surveyResponse = {
      responses,
      submittedAt: new Date(),
      ipAddress: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    const result = await collection.insertOne(surveyResponse);

    return NextResponse.json(
      { 
        message: 'Encuesta enviada exitosamente',
        id: result.insertedId
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error saving survey response:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('customer-satisfaction-survey');
    const collection = db.collection('responses');

    const responses = await collection.find({}).sort({ submittedAt: -1 }).toArray();
    const count = await collection.countDocuments();

    return NextResponse.json({
      responses,
      total: count
    });

  } catch (error) {
    console.error('Error fetching survey responses:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}