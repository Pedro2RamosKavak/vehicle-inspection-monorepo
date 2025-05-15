/**
 * Servicio para almacenamiento temporal de archivos
 */

// Importar la función para almacenar archivos
import { storeFile } from "@/app/api/file-proxy/[id]/route"

/**
 * Sube un archivo y devuelve una URL pública accesible
 * @param file Archivo a subir
 * @returns URL pública del archivo
 */
export async function uploadFileToStorage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        // Obtener los datos base64 del archivo
        const base64Data = reader.result as string
        const base64Content = base64Data.split(",")[1] // Eliminar el prefijo "data:image/jpeg;base64,"

        // Almacenar el archivo en nuestro proxy y obtener su ID
        const fileId = storeFile(base64Content, file.type, file.name)

        // Crear una URL pública que apunte a nuestro endpoint de proxy
        const baseUrl = window.location.origin
        const publicUrl = `${baseUrl}/api/file-proxy/${fileId}`

        console.log(`Archivo subido: ${file.name} - URL: ${publicUrl}`)
        resolve(publicUrl)
      }

      reader.onerror = () => {
        reject(new Error("Error al leer el archivo"))
      }

      // Leer el archivo como URL de datos
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error al subir archivo:", error)
      reject(error)
    }
  })
}

/**
 * Sube múltiples archivos y devuelve sus URLs
 * @param files Archivos a subir
 * @returns URLs públicas de los archivos
 */
export async function uploadMultipleFiles(files: File[]): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadFileToStorage(file))
  return Promise.all(uploadPromises)
}

/**
 * Convierte un archivo a base64 para enviarlo como texto
 * @param file Archivo a convertir
 * @returns Promesa que resuelve a una cadena base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Eliminar el prefijo "data:image/jpeg;base64," para obtener solo el base64
        const base64 = reader.result.split(",")[1]
        resolve(base64)
      } else {
        reject(new Error("No se pudo convertir el archivo a base64"))
      }
    }
    reader.onerror = (error) => reject(error)
  })
}
