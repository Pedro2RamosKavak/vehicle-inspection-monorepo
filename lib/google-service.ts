/**
 * Servicio para gestionar la subida de archivos a Google Drive y Sheets
 */

import { fileToBase64 } from "./storage-service"

/**
 * Envía datos del formulario a Google Sheets y archivos a Google Drive
 */
export async function sendToGoogle(formData: any): Promise<any> {
  try {
    console.log("Procesando envío a Google...")
    
    // 1. Primero, subir archivos a Drive
    const files: Record<string, File> = {}
    
    // Agregar todos los archivos que existan
    if (formData.crlvPhoto) files.crlv = formData.crlvPhoto
    if (formData.videoFile) files.video = formData.videoFile
    if (formData.safetyItemsPhoto) files.safetyItems = formData.safetyItemsPhoto
    if (formData.windshieldPhoto) files.windshield = formData.windshieldPhoto
    if (formData.lightsPhoto) files.lights = formData.lightsPhoto
    if (formData.tiresPhoto) files.tires = formData.tiresPhoto
    
    // Convertir archivos a base64
    const filesBase64: Record<string, any> = {}
    
    for (const [key, file] of Object.entries(files)) {
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
    
    // Subir archivos a Drive con información del cliente para crear la carpeta
    const driveResponse = await fetch("/api/drive-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        licensePlate: formData.licensePlate,
        files_base64: filesBase64
      })
    })
    
    if (!driveResponse.ok) {
      const errorText = await driveResponse.text()
      throw new Error(`Error al subir a Drive: ${driveResponse.status} ${errorText}`)
    }
    
    const driveResult = await driveResponse.json()
    console.log("Respuesta de Drive:", driveResult)
    
    // 2. Luego, enviar datos a Google Sheets incluyendo el link de la carpeta
    const dataForSheets = {
      ...formData,
      driveLink: driveResult.folderLink,
      submissionDate: new Date().toISOString(),
      vehicleConditions: Array.isArray(formData.vehicleConditions) ? formData.vehicleConditions.join(", ") : "",
      safetyItems: Array.isArray(formData.safetyItems) ? formData.safetyItems.join(", ") : ""
    }
    
    const sheetsResponse = await fetch("/api/sheets-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataForSheets)
    })
    
    if (!sheetsResponse.ok) {
      const errorText = await sheetsResponse.text()
      throw new Error(`Error al guardar en Sheets: ${sheetsResponse.status} ${errorText}`)
    }
    
    const sheetsResult = await sheetsResponse.json()
    console.log("Respuesta de Sheets:", sheetsResult)
    
    return {
      success: true,
      drive: driveResult,
      sheets: sheetsResult
    }
  } catch (error) {
    console.error("Error en google-service:", error)
    throw error
  }
} 