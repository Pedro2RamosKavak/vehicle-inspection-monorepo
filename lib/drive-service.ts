/**
 * Servicio para gestionar la subida de archivos a Google Drive
 */

import { fileToBase64 } from "./storage-service"

/**
 * Sube archivos directamente a Google Drive a través de nuestro endpoint propio
 */
export async function uploadToDrive(files: Record<string, File>): Promise<any> {
  try {
    console.log("Subiendo archivos a Google Drive...")
    
    // Convertir archivos a base64
    const filesBase64: Record<string, any> = {}
    
    for (const [key, file] of Object.entries(files)) {
      if (file) {
        try {
          const base64Content = await fileToBase64(file)
          filesBase64[key] = {
            name: file.name,
            type: file.type,
            content: base64Content
          }
        } catch (error) {
          console.error(`Error al convertir ${key} a base64:`, error)
        }
      }
    }
    
    // Enviar al endpoint de Google Drive
    const response = await fetch("/api/drive-upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ files_base64: filesBase64 })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error al subir a Google Drive: ${response.status} ${errorText}`)
    }
    
    const result = await response.json()
    console.log("Respuesta de la API de Google Drive:", result)
    
    return result
  } catch (error) {
    console.error("Error en drive-service:", error)
    throw error
  }
}

/**
 * Prepara los datos del formulario para la subida a Google Drive
 */
export async function prepareFilesForDrive(formData: any): Promise<Record<string, File>> {
  const files: Record<string, File> = {}
  
  // Extraer archivos del formulario
  if (formData.crlvPhoto) {
    files.crlv = formData.crlvPhoto
  }
  
  if (formData.videoFile) {
    files.video = formData.videoFile
  }
  
  if (formData.safetyItemsPhoto) {
    files.safetyItems = formData.safetyItemsPhoto
  }
  
  if (formData.windshieldPhoto) {
    files.windshield = formData.windshieldPhoto
  }
  
  if (formData.lightsPhoto) {
    files.lights = formData.lightsPhoto
  }
  
  if (formData.tiresPhoto) {
    files.tires = formData.tiresPhoto
  }
  
  return files
} 