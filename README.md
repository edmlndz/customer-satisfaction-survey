# Encuesta de Satisfacción del Cliente

Una aplicación web moderna para recopilar feedback de clientes a través de encuestas de satisfacción, construida con Next.js, Tailwind CSS y MongoDB.

## 🚀 Características

- **Interfaz responsive** - Optimizada para dispositivos móviles y desktop
- **5 preguntas personalizables** - Mezcla de ratings, selección múltiple y texto libre
- **Código QR integrado** - Fácil acceso para clientes mediante códigos QR
- **Base de datos MongoDB** - Almacenamiento seguro de respuestas
- **Diseño moderno** - Interfaz limpia y profesional con Tailwind CSS
- **TypeScript** - Desarrollo con tipado estático

## 📋 Preguntas incluidas

1. **Satisfacción general** (Rating 1-5)
2. **Calidad del servicio** (Rating 1-5)  
3. **Amabilidad del personal** (Rating 1-5)
4. **Recomendación** (Opción múltiple)
5. **Comentarios adicionales** (Texto libre)

## 🛠 Instalación

### Prerrequisitos

- Node.js 18+ 
- MongoDB (local o MongoDB Atlas)
- npm o yarn

### Pasos de instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**
   
   El archivo `.env.local` ya está configurado con valores por defecto:
   ```env
   # MongoDB Connection String
   MONGODB_URI=mongodb://localhost:27017/customer-satisfaction-survey
   
   # URL de la aplicación
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Iniciar MongoDB**
   
   Para MongoDB local:
   ```bash
   mongod
   ```
   
   O configura MongoDB Atlas y actualiza `MONGODB_URI` en `.env.local`

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   
   Visita [http://localhost:3000](http://localhost:3000)

## 🌐 Rutas disponibles

- `/` - Página principal con la encuesta
- `/gracias` - Página de confirmación después de enviar la encuesta
- `/qr` - Generador de código QR para compartir la encuesta

## 💾 Base de datos

La aplicación utiliza MongoDB para almacenar las respuestas. La colección `responses` contiene:

```javascript
{
  _id: ObjectId,
  responses: {
    overall_satisfaction: Number,
    service_quality: Number,
    staff_friendliness: Number,
    recommendation: String,
    comments: String
  },
  submittedAt: Date,
  ipAddress: String,
  userAgent: String
}
```

## 📱 Uso del código QR

1. Visita `/qr` en tu aplicación
2. Descarga o imprime el código QR generado
3. Colócalo en un lugar visible para tus clientes
4. Los clientes pueden escanear el código con la cámara de su teléfono para acceder a la encuesta

## 🎨 Personalización

### Modificar las preguntas

Edita el archivo `src/types/survey.ts` para personalizar las preguntas.

### Cambiar estilos

Los estilos se pueden modificar editando las clases de Tailwind CSS en los componentes.

## 🚀 Próximos pasos

Para usar la aplicación completamente:

1. **Configura MongoDB**: Instala MongoDB localmente o crea una cuenta en MongoDB Atlas
2. **Instala dependencias**: Ejecuta `npm install` (requiere resolver problemas de permisos de npm si es necesario)
3. **Inicia la aplicación**: Ejecuta `npm run dev`

¡La aplicación está lista para recopilar feedback de tus clientes! 🎉