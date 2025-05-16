'use client';

import React, { useState } from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
  const [error, setError] = useState(false);
  
  if (!src || src === '') {
    return (
      <div className="rounded-lg overflow-hidden bg-gray-100 shadow-md">
        <div className="p-2 text-center font-medium bg-gray-200">{title || 'Video'}</div>
        <div className="flex items-center justify-center p-4 h-64">
          <p className="text-gray-500">No hay video disponible</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-lg overflow-hidden bg-gray-100 shadow-md">
        <div className="p-2 text-center font-medium bg-gray-200">{title || 'Video'}</div>
        <div className="flex items-center justify-center p-6 flex-col h-64">
          <p className="text-red-500 mb-3">Error al cargar el video</p>
          <a 
            href={src} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Abrir video en una nueva pestaña
          </a>
          <p className="text-gray-500 text-sm mt-4 text-center">
            URL: {src}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      <div className="p-2 text-center font-medium bg-gray-200">{title || 'Video'}</div>
      <video 
        src={src}
        controls
        poster="/video-poster.png"
        className="w-full"
        onError={() => setError(true)}
      >
        Tu navegador no soporta la reproducción de videos.
        <a href={src}>Descargar video</a>
      </video>
      {src && (
        <div className="p-2 text-center">
          <a 
            href={src} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            Abrir video en una nueva pestaña
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer; 