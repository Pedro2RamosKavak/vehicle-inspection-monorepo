/**
 * Servicio para almacenamiento de archivos en Firebase Storage
 */

import { storage } from "./firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storeFile } from "@/app/api/file-proxy/[id]/route"

// Obtener la API Key de ImgBB desde variables de entorno
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "f3ed22278d71d7e5c9bf2283eccc5393";

/**
 * Comprime una imagen antes de subirla para mejorar el rendimiento
 * @param file El archivo de imagen original
 * @param maxWidth Ancho máximo de la imagen comprimida (por defecto 800px)
 * @param quality Calidad de compresión (0-1, por defecto 0.6)
 * @returns Promesa con el archivo comprimido
 */
export async function compressImage(file: File, maxWidth: number = 800, quality: number = 0.6): Promise<File> {
  // Solo comprimir si es una imagen
  if (!file.type.startsWith('image/')) {
    console.log(`El archivo ${file.name} no es una imagen, no se comprime`);
    return file;
  }
  
  // No comprimir GIFs o SVGs
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    console.log(`El archivo ${file.name} es ${file.type}, no se comprime`);
    return file;
  }
  
  // Si el archivo ya es pequeño (menos de 300KB), no comprimir más
  if (file.size < 300 * 1024) {
    console.log(`El archivo ${file.name} ya es pequeño (${Math.round(file.size / 1024)}KB), no se comprime más`);
    return file;
  }
  
  return new Promise((resolve, reject) => {
    try {
      console.log(`Comprimiendo imagen ${file.name} (${Math.round(file.size / 1024)} KB)...`);
      
      // Crear elemento de imagen para cargar el archivo
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = function(e) {
        img.src = e.target?.result as string;
        
        img.onload = function() {
          // Calcular nuevas dimensiones manteniendo la proporción
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }
          
          // Crear un canvas para la compresión
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          // Dibujar la imagen en el canvas
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.warn('No se pudo obtener contexto 2D, devolviendo imagen original');
            resolve(file);
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convertir el canvas a blob con la calidad especificada
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                console.warn('Error al comprimir, devolviendo imagen original');
                resolve(file);
                return;
              }
              
              // Crear nuevo archivo a partir del blob
              const compressedFile = new File(
                [blob], 
                file.name, 
                { type: file.type }
              );
              
              const originalSize = Math.round(file.size / 1024);
              const compressedSize = Math.round(compressedFile.size / 1024);
              const reduction = Math.round(100 - (compressedSize / originalSize * 100));
              
              console.log(
                `Compresión completada: ${originalSize}KB → ${compressedSize}KB (${reduction}% reducción)`
              );
              
              resolve(compressedFile);
            },
            file.type,
            quality
          );
        };
        
        img.onerror = function() {
          console.warn(`Error al cargar la imagen ${file.name}, devolviendo original`);
          resolve(file);
        };
      };
      
      reader.onerror = function() {
        console.warn(`Error al leer el archivo ${file.name}, devolviendo original`);
        resolve(file);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error durante la compresión:', error);
      resolve(file); // En caso de error, devolver la imagen original
    }
  });
}

/**
 * Sube un archivo de imagen a ImgBB y devuelve la URL
 * @param file Archivo de imagen a subir
 * @returns URL de la imagen subida
 */
export async function uploadFileToImgBB(file: File): Promise<string> {
  try {
    console.log(`Preparando subida a ImgBB: ${file.name} (${Math.round(file.size / 1024)} KB, tipo: ${file.type})`);
    
    // Comprimir imagen antes de subir si es una imagen
    const compressedFile = await compressImage(file);
    
    // Crear FormData para la subida
    const formData = new FormData();
    formData.append('image', compressedFile);
    
    // Usar la API key desde variables de entorno
    const apiKey = IMGBB_API_KEY;
    
    // Construir URL con la clave API y agregar parámetro de expiración (10 minutos)
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}&name=${encodeURIComponent(file.name)}&expiration=600`;
    
    console.log(`Enviando imagen a ImgBB: ${file.name}`);
    
    // Enviar la imagen a ImgBB
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en respuesta de ImgBB: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Verificar si la respuesta contiene la URL según la estructura documentada
    if (!data.success) {
      throw new Error(`ImgBB rechazó la imagen: ${JSON.stringify(data)}`);
    }
    
    console.log(`Imagen subida con éxito a ImgBB. ID: ${data.data.id}, URL: ${data.data.url}`);
    
    // Devolver la URL de la imagen según la documentación
    // Usar display_url para obtener la versión optimizada para mostrar
    return data.data.display_url || data.data.url;
  } catch (error: any) {
    console.error('Error al subir imagen a ImgBB:', error);
    // Devolver una URL de imagen de error para que no rompa la aplicación
    return 'https://placehold.co/600x400/red/white?text=Error+al+cargar+imagen';
  }
} 