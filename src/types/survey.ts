export interface SurveyQuestion {
  id: string;
  type: 'rating' | 'text' | 'multiple-choice';
  question: string;
  required: boolean;
  options?: string[];
  maxRating?: number;
}

export interface SurveyResponse {
  _id?: string;
  responses: {
    [questionId: string]: string | number;
  };
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: 'overall_satisfaction',
    type: 'rating',
    question: '¿Qué tan satisfecho está con nuestro servicio en general?',
    required: true,
    maxRating: 5
  },
  {
    id: 'service_quality',
    type: 'rating',
    question: '¿Cómo calificaría la calidad del servicio recibido?',
    required: true,
    maxRating: 5
  },
  {
    id: 'staff_friendliness',
    type: 'rating',
    question: '¿Qué tan amable fue nuestro personal?',
    required: true,
    maxRating: 5
  },
  {
    id: 'recommendation',
    type: 'multiple-choice',
    question: '¿Recomendaría nuestros servicios a familiares y amigos?',
    required: true,
    options: ['Definitivamente sí', 'Probablemente sí', 'Tal vez', 'Probablemente no', 'Definitivamente no']
  },
  {
    id: 'comments',
    type: 'text',
    question: '¿Hay algo que nos gustaría saber para mejorar nuestro servicio?',
    required: false
  }
];