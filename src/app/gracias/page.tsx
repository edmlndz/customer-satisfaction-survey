'use client';

import { useEffect, useState } from 'react';

export default function GraciasPage() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4">
      <div className={`max-w-2xl mx-auto text-center transition-all duration-1000 ${
        showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
      }`}>
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Logo en página de gracias */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="Logo Ándimo" 
              className="h-16 w-auto object-contain filter drop-shadow-lg"
            />
          </div>
          
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ¡Gracias por su tiempo!
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Su opinión ha sido enviada exitosamente. Sus comentarios nos ayudan 
              a mejorar continuamente nuestros servicios.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              ¿Qué pasa ahora?
            </h2>
            <ul className="text-blue-700 space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Su encuesta será revisada por nuestro equipo
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Utilizaremos sus comentarios para mejorar nuestros servicios
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Si dejó información de contacto, podríamos comunicarnos con usted
              </li>
            </ul>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-gray-500 mb-4">
              Esta ventana se puede cerrar de forma segura
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}