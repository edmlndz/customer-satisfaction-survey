'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useRouter } from 'next/navigation';

export default function QRPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [surveyUrl, setSurveyUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const url = `${baseUrl}`;
    setSurveyUrl(url);

    QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1f2937',
        light: '#ffffff'
      }
    })
    .then((url) => {
      setQrCodeUrl(url);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Error generating QR code:', err);
      setLoading(false);
    });
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'encuesta-satisfaccion-qr.png';
    link.href = qrCodeUrl;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Código QR - Encuesta de Satisfacción</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 40px;
                margin: 0;
              }
              .container {
                max-width: 400px;
                margin: 0 auto;
              }
              .qr-code {
                margin: 20px 0;
              }
              .instructions {
                margin-top: 20px;
                font-size: 14px;
                line-height: 1.5;
              }
              @media print {
                body { padding: 20px; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Encuesta de Satisfacción</h1>
              <div class="qr-code">
                <img src="${qrCodeUrl}" alt="Código QR para la encuesta" />
              </div>
              <p><strong>Escanea el código QR para acceder a la encuesta</strong></p>
              <div class="instructions">
                <p>1. Abre la cámara de tu teléfono</p>
                <p>2. Apunta hacia el código QR</p>
                <p>3. Toca la notificación que aparece</p>
                <p>4. Completa la encuesta</p>
              </div>
              <p style="font-size: 12px; color: #666; margin-top: 30px;">
                URL: ${surveyUrl}
              </p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    console.log('Intentando login con:', { email, password });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Guardar token en localStorage
        localStorage.setItem('auth-token', data.token);
        console.log('Token guardado, redirigiendo...');
        // Redireccionar al dashboard
        router.push('/dashboard');
      } else {
        setLoginError(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setLoginError('Error de conexión');
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generando código QR...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Código QR para la Encuesta
          </h1>
          <p className="text-lg text-gray-600">
            Comparte este código QR para que tus clientes puedan acceder fácilmente a la encuesta
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Código QR
            </h2>
            {qrCodeUrl && (
              <div className="mb-6">
                <img 
                  src={qrCodeUrl} 
                  alt="Código QR para la encuesta" 
                  className="mx-auto rounded-lg shadow-md"
                />
              </div>
            )}
            <div className="space-y-4">
              <button
                onClick={handleDownload}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Descargar QR
              </button>
              <button
                onClick={handlePrint}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Instrucciones de uso
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Descarga o imprime el QR</h3>
                  <p className="text-gray-600 text-sm">Guarda el código QR en tu dispositivo o imprímelo para colocarlo en un lugar visible.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Coloca el QR visible</h3>
                  <p className="text-gray-600 text-sm">Ubica el código en la recepción, mesa, o área donde los clientes puedan verlo fácilmente.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Los clientes escanean</h3>
                  <p className="text-gray-600 text-sm">Los clientes pueden usar la cámara de su teléfono para escanear y acceder a la encuesta.</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">URL de la encuesta:</h4>
                <code className="text-sm text-gray-600 break-all">{surveyUrl}</code>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <a
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Ver encuesta
              </a>
            </div>
          </div>

          {/* Login Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Acceso Administrador
            </h2>
            
            {!showLogin ? (
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Accede al panel de administración para ver las respuestas de la encuesta
                </p>
                <button
                  onClick={() => setShowLogin(true)}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Iniciar Sesión
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{loginError}</p>
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="admin@empresa.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loginLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Iniciando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                        </svg>
                        Acceder al Dashboard
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowLogin(false);
                      setEmail('');
                      setPassword('');
                      setLoginError('');
                    }}
                    className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
            
            <div className="mt-6 pt-6 border-t">
              <div className="text-sm text-gray-500">
                <p className="font-medium mb-1">Credenciales por defecto:</p>
                <p>Email: admin@empresa.com</p>
                <p>Contraseña: admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}