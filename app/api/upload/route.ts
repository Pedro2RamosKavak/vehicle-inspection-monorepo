/**
 * API endpoint para manejar la subida de archivos
 * Este endpoint recibe archivos y los sube a Cloudinary
 */

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfhouz0vx',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '273373859889187',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'fNSgFfeo4v9fUln4sy5MYFVV9OA',
  secure: true
});

/**
 * Función para comprimir la imagen en el servidor usando sharp
 * @param buffer Buffer de la imagen
 * @param mimeType Tipo MIME de la imagen
 * @returns Buffer comprimido
 */
async function compressImageBuffer(buffer: Buffer, mimeType: string): Promise<Buffer> {
  if (!mimeType.startsWith('image/')) {
    return buffer;
  }
  
  try {
    let sharpInstance = sharp(buffer);
    
    // Redimensionar si es necesario (máximo 800px de ancho manteniendo relación de aspecto)
    sharpInstance = sharpInstance.resize({
      width: 800,
      height: undefined,
      fit: 'inside',
      withoutEnlargement: true
    });
    
    // Comprimir según el tipo de imagen
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
      return await sharpInstance.jpeg({ quality: 60 }).toBuffer();
    } else if (mimeType === 'image/png') {
      return await sharpInstance.png({ quality: 60 }).toBuffer();
    } else if (mimeType === 'image/webp') {
      return await sharpInstance.webp({ quality: 60 }).toBuffer();
    } else {
      // Para otros formatos, devolver el buffer tal cual
      return buffer;
    }
  } catch (error) {
    console.error("Error comprimiendo imagen con sharp:", error);
    return buffer; // En caso de error, devolver el buffer original
  }
}

/**
 * Sube un archivo a Cloudinary
 */
async function uploadToCloudinary(buffer: Buffer, mimeType: string, fileName: string): Promise<string> {
  try {
    // Determinar el tipo de recurso
    const isVideo = mimeType.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';
    const folder = isVideo ? 'vehicle-inspection-videos' : 'vehicle-inspection-images';
    
    console.log(`Preparando subida a Cloudinary (${resourceType}): ${fileName}`);
    
    // Comprimir solo si es imagen
    if (!isVideo) {
      buffer = await compressImageBuffer(buffer, mimeType);
    }
    
    // Convertir buffer a base64
    const base64Data = buffer.toString('base64');
    const dataURI = `data:${mimeType};base64,${base64Data}`;
    
    // Opciones de subida
    const uploadOptions = {
      resource_type: resourceType as 'video' | 'image',
      folder: folder,
      public_id: `${fileName.split('.')[0]}_${Date.now()}`,
      ...(isVideo && {
        eager_async: true,
        eager: [{ format: 'mp4', quality: 'auto' }],
        chunk_size: 20000000
      })
    };
    
    // Subir archivo
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error(`Error al subir ${resourceType}:`, error);
            reject(error);
          } else {
            console.log(`${resourceType} subido exitosamente:`, result);
            resolve(result);
          }
        }
      );
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Error en uploadToCloudinary:', error);
    throw error;
  }
}

/**
 * Manejador POST para subir archivos
 */
export async function POST(request: NextRequest) {
  try {
    console.log("Recibida solicitud de subida de archivo");
    
    // Obtener el archivo del FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No se recibió ningún archivo' }, { status: 400 });
    }
    
    // Obtener información del archivo
    const bytes = file.size;
    const fileType = file.type;
    const fileName = file.name;
    console.log(`Archivo recibido: ${fileName} (${bytes} bytes, tipo: ${fileType})`);
    
    // Convertir el archivo a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Subir archivo a Cloudinary
    const url = await uploadToCloudinary(buffer, fileType, fileName);
    
    return NextResponse.json({ 
      success: true, 
      url,
      type: fileType,
      size: bytes,
      name: fileName
    });
    
  } catch (error: any) {
    console.error('Error al procesar la subida de archivo:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error desconocido al procesar el archivo'
      },
      { status: 500 }
    );
  }
} 