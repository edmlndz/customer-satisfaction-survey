'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SurveyResponse {
  _id: string;
  responses: {
    overall_satisfaction: number;
    service_quality: number;
    staff_friendliness: number;
    recommendation: string;
    comments: string;
  };
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

interface Stats {
  totalResponses: number;
  averageRatings: {
    overall_satisfaction: number;
    service_quality: number;
    staff_friendliness: number;
  };
  recommendationDistribution: {
    [key: string]: number;
  };
}

interface DashboardData {
  responses: SurveyResponse[];
  stats: Stats;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  console.log('Dashboard component loaded');

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/qr');
      return;
    }

    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      const response = await fetch('/api/dashboard/responses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth-token');
          router.push('/qr');
          return;
        }
        throw new Error('Error al obtener los datos');
      }

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      setError('Error al cargar los datos del dashboard');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    router.push('/qr');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/qr')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard de Encuestas
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">admin@empresa.com</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('responses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'responses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Respuestas Individuales
            </button>
          </nav>
        </div>

        {activeTab === 'overview' && data && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total de Respuestas
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {data.stats.totalResponses}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Satisfacción General
                        </dt>
                        <dd className={`text-lg font-medium ${getRatingColor(data.stats.averageRatings.overall_satisfaction)}`}>
                          {data.stats.averageRatings.overall_satisfaction}/5
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Calidad del Servicio
                        </dt>
                        <dd className={`text-lg font-medium ${getRatingColor(data.stats.averageRatings.service_quality)}`}>
                          {data.stats.averageRatings.service_quality}/5
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Amabilidad del Personal
                        </dt>
                        <dd className={`text-lg font-medium ${getRatingColor(data.stats.averageRatings.staff_friendliness)}`}>
                          {data.stats.averageRatings.staff_friendliness}/5
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Chart */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Distribución de Recomendaciones
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-8">
                  {/* Gráfico Circular */}
                  <div className="flex justify-center">
                    <svg width="300" height="300" className="transform -rotate-90">
                      {(() => {
                        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
                        let currentAngle = 0;
                        const total = data.stats.totalResponses;
                        const centerX = 150;
                        const centerY = 150;
                        const radius = 120;
                        
                        return Object.entries(data.stats.recommendationDistribution).map(([key, value], index) => {
                          if (value === 0) return null;
                          
                          const percentage = total > 0 ? (value / total) * 100 : 0;
                          const angle = (percentage / 100) * 360;
                          const startAngle = currentAngle;
                          const endAngle = currentAngle + angle;
                          
                          const startAngleRad = (startAngle * Math.PI) / 180;
                          const endAngleRad = (endAngle * Math.PI) / 180;
                          
                          const x1 = centerX + radius * Math.cos(startAngleRad);
                          const y1 = centerY + radius * Math.sin(startAngleRad);
                          const x2 = centerX + radius * Math.cos(endAngleRad);
                          const y2 = centerY + radius * Math.sin(endAngleRad);
                          
                          const largeArcFlag = angle > 180 ? 1 : 0;
                          
                          const pathData = [
                            `M ${centerX} ${centerY}`,
                            `L ${x1} ${y1}`,
                            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                            'Z'
                          ].join(' ');
                          
                          currentAngle += angle;
                          
                          return (
                            <path
                              key={key}
                              d={pathData}
                              fill={colors[index % colors.length]}
                              stroke="white"
                              strokeWidth="2"
                              className="transition-all duration-300 hover:opacity-80"
                            />
                          );
                        });
                      })()}
                      
                      {/* Centro del gráfico */}
                      <circle
                        cx="150"
                        cy="150"
                        r="50"
                        fill="white"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <text
                        x="150"
                        y="145"
                        textAnchor="middle"
                        className="text-sm font-medium fill-gray-600 transform rotate-90"
                        style={{ transformOrigin: '150px 145px' }}
                      >
                        Total
                      </text>
                      <text
                        x="150"
                        y="165"
                        textAnchor="middle"
                        className="text-lg font-bold fill-gray-900 transform rotate-90"
                        style={{ transformOrigin: '150px 165px' }}
                      >
                        {data.stats.totalResponses}
                      </text>
                    </svg>
                  </div>
                  
                  {/* Leyenda en filas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(() => {
                      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
                      return Object.entries(data.stats.recommendationDistribution).map(([key, value], index) => {
                        const percentage = data.stats.totalResponses > 0 ? Math.round((value / data.stats.totalResponses) * 100) : 0;
                        return (
                          <div key={key} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                            <div
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: colors[index % colors.length] }}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{key}</div>
                              <div className="text-xs text-gray-500">
                                {value} respuestas ({percentage}%)
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'responses' && data && (
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Respuestas Individuales ({data.responses.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {data.responses.map((response) => (
                  <div key={response._id} className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-500">
                            {formatDate(response.submittedAt)}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Satisfacción General:
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {getStars(response.responses.overall_satisfaction)}
                              </div>
                              <span className="text-sm text-gray-600">
                                ({response.responses.overall_satisfaction}/5)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Calidad del Servicio:
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {getStars(response.responses.service_quality)}
                              </div>
                              <span className="text-sm text-gray-600">
                                ({response.responses.service_quality}/5)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Amabilidad del Personal:
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {getStars(response.responses.staff_friendliness)}
                              </div>
                              <span className="text-sm text-gray-600">
                                ({response.responses.staff_friendliness}/5)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Recomendación:
                            </span>
                            <span className="text-sm text-gray-600">
                              {response.responses.recommendation}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">
                            Comentarios:
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">
                            {response.responses.comments || 'Sin comentarios'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {data.responses.length === 0 && (
                  <div className="p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No hay respuestas aún
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Las respuestas aparecerán aquí cuando los clientes completen la encuesta.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}