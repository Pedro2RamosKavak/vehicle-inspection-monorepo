'use client';

import React, { useState, useEffect } from 'react';

interface UploadProgressBarProps {
  currentStep: number;
  totalSteps: number;
  isUploading: boolean;
  uploadText?: string;
  completeText?: string;
}

/**
 * Componente que muestra una barra de progreso para la carga de archivos
 */
const UploadProgressBar: React.FC<UploadProgressBarProps> = ({
  currentStep,
  totalSteps,
  isUploading,
  uploadText = "Enviando arquivos...",
  completeText = "Envio completo!"
}) => {
  const [progress, setProgress] = useState(0);
  
  // Calcular el progreso basado en los pasos completados del formulario
  const baseProgress = Math.min(100, Math.round((currentStep / totalSteps) * 100));
  
  // Efecto para animar el progreso durante la subida
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isUploading) {
      // Comenzar en el progreso base (normalmente 50%)
      setProgress(baseProgress);
      
      // Simular progreso gradualmente hasta llegar a casi el 100%
      interval = setInterval(() => {
        setProgress(prev => {
          // Avanzar más rápido al principio, más lento cerca del final
          const remaining = 100 - prev;
          const increment = Math.max(0.5, remaining * 0.05);
          
          // Si estamos cerca del final, detenerse antes del 100%
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          
          return Math.min(95, prev + increment);
        });
      }, 500);
    } else {
      // Mostrar 100% cuando se completa
      setProgress(100);
    }
    
    return () => clearInterval(interval);
  }, [isUploading, baseProgress]);
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-blue-700">
          {progress < 100 ? uploadText : completeText}
        </span>
        <span className="text-sm font-medium text-blue-700">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
        <div 
          className={`h-4 rounded-full ${progress < 100 ? 'bg-blue-600' : 'bg-green-600'} relative transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
        >
          {/* Efecto de animación en la barra */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`h-full w-full ${progress < 100 ? 'bg-blue-500' : 'bg-green-500'} absolute top-0 left-0 animate-pulse`}></div>
          </div>
        </div>
      </div>
      
      {progress < 100 && isUploading && (
        <p className="text-xs text-gray-500 mt-2">
          Aguarde enquanto processamos seus arquivos. Isto pode levar alguns momentos...
        </p>
      )}
      
      {progress === 100 && (
        <p className="text-xs text-green-600 mt-2">
          Todos os arquivos foram processados com sucesso!
        </p>
      )}
    </div>
  );
};

export default UploadProgressBar; 