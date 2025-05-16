'use client';

/**
 * Servicio para gestionar la subida de archivos a Cloudinary vía API
 * Este servicio no importa directamente el SDK de Cloudinary para evitar problemas con Next.js
 */

/**
 * Convierte un archivo a formato base64 para transmisión (solo si es necesario localmente)
 * @param file Archivo a convertir
 * @returns Promesa con el string base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

/**
 * Sube un archivo a Cloudinary a través del endpoint de la API
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  try {
    console.log(`Iniciando subida a través de API: ${file.name} (${Math.round(file.size / 1024)} KB)`);
    
    // Crear un objeto FormData para enviar el archivo
    const formData = new FormData();
    formData.append('file', file);
    
    // Llamar a nuestra API
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    // Procesar la respuesta
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error al subir el archivo');
    }
    
    console.log(`Archivo subido con éxito:`, result.url);
    return result.url;
    
  } catch (error: any) {
    console.error('Error en el servicio de subida:', error);
    throw error;
  }
}

/**
 * Sube un video a Cloudinary
 */
export async function uploadVideoToCloudinary(file: File): Promise<string> {
  try {
    console.log(`Iniciando subida de video: ${file.name} (${Math.round(file.size / 1024 / 1024)} MB)`);
    
    // Verificar que es un video
    if (!file.type.startsWith('video/')) {
      throw new Error('El archivo no es un video');
    }
    
    // Crear FormData y agregar el video
    const formData = new FormData();
    formData.append('file', file);
    
    // Llamar al endpoint de subida
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error al subir el video');
    }
    
    console.log('Video subido exitosamente:', result.url);
    return result.url;
    
  } catch (error: any) {
    console.error('Error al subir video:', error);
    throw error;
  }
} 