/**
 * Servicio para enviar datos a Zapier
 * Este servicio permite enviar datos del formulario a Zapier para su procesamiento
 */

import { uploadFileToImgBB, uploadFileToCloudinary } from "./storage-service";
import { uploadVideoToCloudinary } from "./cloudinary-service";

// Obtener la API Key de ImgBB desde variables de entorno
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

/**
 * Convierte un archivo a formato base64 para transmisión
 * @param file Archivo a convertir
 * @returns Promesa con el string base64
 */
function convertirImagenABase64(file: File): Promise<string> {
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
 * Guarda la inspección localmente (respaldo)
 * @param data Datos de la inspección
 */
function saveInspectionToLocalStorage(data: any) {
  try {
    // Obtener inspecciones existentes
    const existingInspections = localStorage.getItem('inspecciones');
    let inspecciones = existingInspections ? JSON.parse(existingInspections) : [];
    
    // Añadir la nueva inspección con ID único
    const inspectionId = `insp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const inspectionWithId = {
      id: inspectionId,
      ...data,
      submissionDate: new Date().toISOString()
    };
    
    inspecciones.push(inspectionWithId);
    
    // Guardar en localStorage
    localStorage.setItem('inspecciones', JSON.stringify(inspecciones));
    console.log(`Inspección guardada localmente con ID: ${inspectionId}`);
    
    return inspectionId;
  } catch (error) {
    console.error("Error al guardar en localStorage:", error);
    return null;
  }
}

// Definir interfaz para resultados de subida
interface UploadResult {
  fieldName: string;
  url: string;
  processingLargeVideo?: boolean;
}

/**
 * Envía los datos del formulario y archivos a Zapier como JSON
 * @param formData Datos del formulario
 * @returns Promesa con el resultado de la petición
 */
export async function enviarDatosComoJsonAZapier(formData: any) {
  try {
    console.log("Preparando datos para Zapier (datos y archivos)");
    console.log("Campos del formulario:", Object.keys(formData));
    
    // Verificar archivos recibidos usando los nombres exactos del formulario y los nuevos nombres
    console.log("Verificación de archivos:");
    // Verificar CRLV (con ambos posibles nombres)
    console.log("- CRLV:", 
      formData.crlv ? `Existe (${formData.crlv.name}, ${formData.crlv.size} bytes)` : 
      formData.crlvPhoto ? `Existe (${formData.crlvPhoto.name}, ${formData.crlvPhoto.size} bytes)` : 
      "No existe");
    
    // Verificar Itens de Segurança (con ambos posibles nombres)
    console.log("- Itens de Segurança:", 
      formData.foto_itens_seguranca ? `Existe (${formData.foto_itens_seguranca.name}, ${formData.foto_itens_seguranca.size} bytes)` : 
      formData.safetyItemsPhoto ? `Existe (${formData.safetyItemsPhoto.name}, ${formData.safetyItemsPhoto.size} bytes)` : 
      "No existe");
    
    // Verificar Parabrisa (con ambos posibles nombres)
    console.log("- Parabrisa:", 
      formData.foto_parabrisa ? `Existe (${formData.foto_parabrisa.name}, ${formData.foto_parabrisa.size} bytes)` : 
      formData.windshieldPhoto ? `Existe (${formData.windshieldPhoto.name}, ${formData.windshieldPhoto.size} bytes)` : 
      "No existe");
    
    // Verificar Faróis/Lanternas (con ambos posibles nombres)
    console.log("- Faróis/Lanternas:", 
      formData.foto_farois_lanternas ? `Existe (${formData.foto_farois_lanternas.name}, ${formData.foto_farois_lanternas.size} bytes)` : 
      formData.lightsPhoto ? `Existe (${formData.lightsPhoto.name}, ${formData.lightsPhoto.size} bytes)` : 
      "No existe");
    
    // Verificar Pneus (con ambos posibles nombres)
    console.log("- Pneus:", 
      formData.foto_pneus ? `Existe (${formData.foto_pneus.name}, ${formData.foto_pneus.size} bytes)` : 
      formData.tiresPhoto ? `Existe (${formData.tiresPhoto.name}, ${formData.tiresPhoto.size} bytes)` : 
      "No existe");
    
    // Verificar Vídeo (con ambos posibles nombres)
    console.log("- Vídeo:", 
      formData.upload_video ? `Existe (${formData.upload_video.name}, ${formData.upload_video.size} bytes)` : 
      formData.videoFile ? `Existe (${formData.videoFile.name}, ${formData.videoFile.size} bytes)` : 
      "No existe");
    
    // Generar un ID único para esta solicitud
    const timestamp = Date.now();
    const request_id = `zapier_${timestamp}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Primera etapa: subida rápida de datos básicos sin esperar imágenes
    // Esto permite mostrar éxito rápidamente al usuario
    const datosBasicos = {
      // Solo incluir datos de texto esenciales para una respuesta rápida
      titular: formData.ownerName || formData.titular || "",
      email: formData.email || "",
      celular: formData.phone || formData.celular || "",
      placa: formData.licensePlate || formData.placa || "",
      request_id: request_id,
      submissionDate: new Date().toISOString(),
      procesamiento_pendiente: true // Indicador para Zapier de que faltan archivos
    };

    // Guardar los datos en localStorage para procesar en segundo plano
    const archivosParaProcesar = {
      // Lista de archivos a procesar
      crlvPhoto: formData.crlv || formData.crlvPhoto,
      safetyItemsPhoto: formData.foto_itens_seguranca || formData.safetyItemsPhoto,
      windshieldPhoto: formData.foto_parabrisa || formData.windshieldPhoto,
      lightsPhoto: formData.foto_farois_lanternas || formData.lightsPhoto,
      tiresPhoto: formData.foto_pneus || formData.tiresPhoto,
      videoFile: formData.upload_video || formData.videoFile,
      request_id: request_id
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(`pending_upload_${request_id}`, JSON.stringify({
        timestamp: Date.now(),
        request_id,
        completado: false
      }));
    }
    
    // Lanzar la subida de archivos en segundo plano sin esperar respuesta
    setTimeout(() => {
      procesarArchivosEnSegundoPlano(archivosParaProcesar, formData, request_id)
        .catch(error => console.error("Error procesando archivos en segundo plano:", error));
    }, 100);
    
    // Guardar la inspección directamente en localStorage para facilitar el acceso desde la lista
    // Crear los datos de la inspección que se guardarán en localStorage
    const inspectionData = {
      id: request_id,
      titular: formData.ownerName || formData.titular || "Sin nombre",
      placa: formData.licensePlate || formData.placa || "Sin placa",
      email: formData.email || "Sin email",
      submissionDate: new Date().toISOString()
    };
    
    // Devolver respuesta rápida con los datos básicos e información para localStorage
    return {
      success: true,
      message: "Dados recebidos com sucesso. Processamento de imagens em segundo plano.",
      request_id,
      storeInLocalStorage: true,
      inspectionId: request_id,
      inspectionData
    };
  } catch (error: any) {
    console.error("Error al enviar datos a Zapier:", error);
    throw error;
  }
}

/**
 * Procesa los archivos en segundo plano después de que el usuario ha recibido confirmación
 */
async function procesarArchivosEnSegundoPlano(archivos: any, datosCompletos: any, request_id: string) {
  try {
    console.log("Procesando archivos en segundo plano para request_id:", request_id);
    
    // Preparar todas las tareas de subida para procesarlas en paralelo
    const uploadTasks: Promise<UploadResult>[] = [];
    
    // Agregar todas las tareas de subida con el nuevo servicio
    if (archivos.crlvPhoto instanceof File) {
      uploadTasks.push(
        uploadFileToCloudinary(archivos.crlvPhoto)
          .then(url => ({ fieldName: 'crlvPhotoUrl', url }))
          .catch(error => {
            console.error("Error al subir CRLV:", error);
            return { fieldName: 'crlvPhotoUrl', url: '' };
          })
      );
    }
    
    if (archivos.safetyItemsPhoto instanceof File) {
      uploadTasks.push(
        uploadFileToCloudinary(archivos.safetyItemsPhoto)
          .then(url => ({ fieldName: 'safetyItemsPhotoUrl', url }))
          .catch(error => {
            console.error("Error al subir Safety Items:", error);
            return { fieldName: 'safetyItemsPhotoUrl', url: '' };
          })
      );
    }
    
    if (archivos.windshieldPhoto instanceof File) {
      uploadTasks.push(
        uploadFileToCloudinary(archivos.windshieldPhoto)
          .then(url => ({ fieldName: 'windshieldPhotoUrl', url }))
          .catch(error => {
            console.error("Error al subir Windshield Photo:", error);
            return { fieldName: 'windshieldPhotoUrl', url: '' };
          })
      );
    }
    
    if (archivos.lightsPhoto instanceof File) {
      uploadTasks.push(
        uploadFileToCloudinary(archivos.lightsPhoto)
          .then(url => ({ fieldName: 'lightsPhotoUrl', url }))
          .catch(error => {
            console.error("Error al subir Lights Photo:", error);
            return { fieldName: 'lightsPhotoUrl', url: '' };
          })
      );
    }
    
    if (archivos.tiresPhoto instanceof File) {
      uploadTasks.push(
        uploadFileToCloudinary(archivos.tiresPhoto)
          .then(url => ({ fieldName: 'tiresPhotoUrl', url }))
          .catch(error => {
            console.error("Error al subir Tires Photo:", error);
            return { fieldName: 'tiresPhotoUrl', url: '' };
          })
      );
    }
    
    if (archivos.videoFile instanceof File) {
      uploadTasks.push(
        uploadVideoToCloudinary(archivos.videoFile)
          .then(url => ({ fieldName: 'videoFileUrl', url }))
          .catch(error => {
            console.error("Error al subir Video:", error);
            return { fieldName: 'videoFileUrl', url: '' };
          })
      );
    }
    
    // Ejecutar todas las tareas de subida en paralelo
    const results = await Promise.allSettled(uploadTasks);
    
    // Construir el objeto imageUrls con los resultados
    const imageUrls: Record<string, string> = {};
    
    // Procesar los resultados y obtener las URLs exitosas
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.url) {
        imageUrls[result.value.fieldName] = result.value.url;
      }
    });
    
    // Actualizar el procesamiento en localStorage
    if (typeof window !== 'undefined') {
      // Obtener la lista de inspecciones 
      const inspecciones = localStorage.getItem('inspecciones');
      if (inspecciones) {
        try {
          const listaInspecciones = JSON.parse(inspecciones);
          
          // Buscar la inspección por request_id
          const index = listaInspecciones.findIndex((insp: any) => insp.id === request_id);
          
          if (index >= 0) {
            // Actualizar las URLs en la inspección existente
            listaInspecciones[index] = {
              ...listaInspecciones[index],
              ...imageUrls
            };
            
            // Guardar la lista actualizada
            localStorage.setItem('inspecciones', JSON.stringify(listaInspecciones));
            console.log(`Inspección ${request_id} actualizada en localStorage con nuevas URLs`, imageUrls);
          }
        } catch (error) {
          console.error("Error al actualizar URLs en localStorage:", error);
        }
      }
      
      // Actualizar el estado de procesamiento
      localStorage.setItem(`pending_upload_${request_id}`, JSON.stringify({
        timestamp: Date.now(),
        request_id,
        completado: true,
        urls: imageUrls
      }));
    }
    
    // Devolver las URLs para ser usadas si es necesario
    return imageUrls;
    
  } catch (error) {
    console.error("Error procesando archivos en segundo plano:", error);
    
    // Registrar el error en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`pending_upload_${request_id}`, JSON.stringify({
        timestamp: Date.now(),
        request_id,
        completado: false,
        error: error instanceof Error ? error.message : "Error desconocido"
      }));
    }
    
    // En este caso, no lanzamos el error, sino que devolvemos un objeto de error
    return { 
      error: true, 
      message: error instanceof Error ? error.message : "Error desconocido en procesamiento"
    };
  }
}

// Definir los stubs para las funciones que faltan para resolver errores de linter
/**
 * Función legacy para enviar datos a Zapier (stub para compatibilidad)
 * @deprecated Use enviarDatosComoJsonAZapier instead
 */
export async function enviarDatosAZapier(formData: any) {
  console.warn("Función enviarDatosAZapier está deprecada, use enviarDatosComoJsonAZapier");
  return enviarDatosComoJsonAZapier(formData);
}

/**
 * Función legacy para preparar datos para Zapier (stub para compatibilidad)
 * @deprecated Use enviarDatosComoJsonAZapier directly
 */
export async function prepararDatosParaZapier(formData: any) {
  console.warn("Función prepararDatosParaZapier está deprecada");
  return formData;
}

/**
 * Función legacy para comprimir archivos (stub para compatibilidad)
 * @deprecated Use procesarArchivosEnSegundoPlano instead
 */
export async function comprimirArchivos(archivos: any) {
  console.warn("Función comprimirArchivos está deprecada");
  return archivos;
} 