'use client';

import { useState } from 'react';
import { surveyQuestions } from '@/types/survey';

interface SurveyFormProps {
  onSubmit: (responses: Record<string, string | number>) => Promise<void>;
  isSubmitting: boolean;
}

export default function SurveyForm({ onSubmit, isSubmitting }: SurveyFormProps) {
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    surveyQuestions.forEach(question => {
      if (question.required && !responses[question.id]) {
        newErrors[question.id] = 'Esta pregunta es obligatoria';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onSubmit(responses);
  };

  const handleResponseChange = (questionId: string, value: string | number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const renderRatingQuestion = (question: any) => {
    const maxRating = question.maxRating || 5;
    
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: maxRating }, (_, i) => i + 1).map(rating => (
            <button
              key={rating}
              type="button"
              onClick={() => handleResponseChange(question.id, rating)}
              className={`w-12 h-12 rounded-full border-2 font-semibold transition-all duration-200 ${
                responses[question.id] === rating
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg transform scale-110'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 px-2">
          <span>Muy malo</span>
          <span>Excelente</span>
        </div>
      </div>
    );
  };

  const renderMultipleChoiceQuestion = (question: any) => (
    <div className="space-y-2">
      {question.options?.map((option: string, index: number) => (
        <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <input
            type="radio"
            name={question.id}
            value={option}
            checked={responses[question.id] === option}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="w-5 h-5 text-blue-600"
          />
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  );

  const renderTextQuestion = (question: any) => (
    <textarea
      value={responses[question.id] || ''}
      onChange={(e) => handleResponseChange(question.id, e.target.value)}
      rows={4}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500"
      placeholder="Escriba su respuesta aquí..."
    />
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {surveyQuestions.map((question, index) => (
        <div key={question.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {index + 1}. {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
          </div>
          
          <div className="mb-4">
            {question.type === 'rating' && renderRatingQuestion(question)}
            {question.type === 'multiple-choice' && renderMultipleChoiceQuestion(question)}
            {question.type === 'text' && renderTextQuestion(question)}
          </div>

          {errors[question.id] && (
            <p className="text-red-500 text-sm mt-2">{errors[question.id]}</p>
          )}
        </div>
      ))}

      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Encuesta'}
        </button>
      </div>
    </form>
  );
}