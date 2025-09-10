'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SurveyForm from '@/components/SurveyForm';

export default function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (responses: Record<string, string | number>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar la encuesta');
      }

      router.push('/gracias');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="Logo Ándimo" 
              className="h-20 w-auto object-contain filter drop-shadow-lg"
            />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Encuesta de Satisfacción
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Su opinión es muy importante para nosotros. Por favor, tómese unos minutos 
            para compartir su experiencia con nuestros servicios.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <SurveyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Esta encuesta es completamente anónima y sus datos están protegidos.</p>
        </div>
      </div>
    </div>
  );
}