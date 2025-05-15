/**
 * Servicio para enviar datos a Zapier
 */

import { uploadFileToStorage } from "./storage-service"

/**
 * Envía los datos del formulario a través de nuestra API interna
 * @param formData Datos del formulario a enviar
 * @returns Promesa que resuelve a un objeto con el estado del envío
 */
export async function enviarDatosAZapier(formData: FormData) {
  try {
    console.log("Enviando datos a través de la API interna")

    // Enviar los datos a nuestra API interna
    const response = await fetch("/api/submit-form", {
      method: "POST",
      body: formData,
    })

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error en la respuesta de la API:", errorText)
      throw new Error(`Error al enviar datos: ${response.status} ${response.statusText}`)
    }

    const responseData = await response.json()
    console.log("Respuesta de la API:", responseData)

    // Devolver el resultado
    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error al enviar datos a través de la API:", error)
    throw error
  }
}

/**
 * Prepara los datos del formulario para enviar a Zapier, subiendo archivos a almacenamiento
 * y enviando solo las URLs a Zapier
 * @param datos Datos del formulario
 * @returns Promesa que resuelve a un FormData listo para enviar
 */
export async function prepararDatosParaZapier(datos: any): Promise<FormData> {
  const formData = new FormData()

  if (!datos) {
    console.error("No hay datos para enviar a Zapier")
    return formData
  }

  // Información personal
  formData.append("ownerName", datos.ownerName || "")
  formData.append("email", datos.email || "")
  formData.append("phone", datos.phone || "")

  // Información del auto
  formData.append("licensePlate", datos.licensePlate || "")
  formData.append("currentKm", datos.currentKm || "")
  formData.append("modelYear", datos.modelYear || "")
  formData.append("hasChassisNumber", datos.hasChassisNumber || "")
  formData.append("hasSecondKey", datos.hasSecondKey || "")

  // Condición del vehículo
  if (datos.vehicleConditions && Array.isArray(datos.vehicleConditions)) {
    formData.append("vehicleConditions", datos.vehicleConditions.join(", "))
  }

  if (datos.safetyItems && Array.isArray(datos.safetyItems)) {
    formData.append("safetyItems", datos.safetyItems.join(", "))
  }

  formData.append("hasAirConditioner", datos.hasAirConditioner || "")
  formData.append("hasWindshieldDamage", datos.hasWindshieldDamage || "")
  formData.append("hasLightsDamage", datos.hasLightsDamage || "")
  formData.append("hasTiresDamage", datos.hasTiresDamage || "")
  formData.append("hasOriginalSoundSystem", datos.hasOriginalSoundSystem || "")

  // Subir archivos a almacenamiento y guardar las URLs
  const fileUploads = []

  // CRLV Photo
  if (datos.crlvPhoto) {
    try {
      const url = await uploadFileToStorage(datos.crlvPhoto)
      formData.append("crlvPhotoUrl", url)
      // Añadir URL directamente para facilitar el uso en Zapier
      formData.append("crlvPhoto_file_url", url)
      fileUploads.push({ name: "CRLV", url, type: "image", originalName: datos.crlvPhoto.name })
    } catch (error) {
      console.error("Error al subir foto CRLV:", error)
    }
  }

  // Safety Items Photo
  if (datos.safetyItemsPhoto) {
    try {
      const url = await uploadFileToStorage(datos.safetyItemsPhoto)
      formData.append("safetyItemsPhotoUrl", url)
      // Añadir URL directamente para facilitar el uso en Zapier
      formData.append("safetyItemsPhoto_file_url", url)
      fileUploads.push({
        name: "Safety Items",
        url,
        type: "image",
        originalName: datos.safetyItemsPhoto.name,
      })
    } catch (error) {
      console.error("Error al subir foto de items de seguridad:", error)
    }
  }

  // Windshield Photo
  if (datos.windshieldPhoto) {
    try {
      const url = await uploadFileToStorage(datos.windshieldPhoto)
      formData.append("windshieldPhotoUrl", url)
      // Añadir URL directamente para facilitar el uso en Zapier
      formData.append("windshieldPhoto_file_url", url)
      fileUploads.push({
        name: "Windshield",
        url,
        type: "image",
        originalName: datos.windshieldPhoto.name,
      })
    } catch (error) {
      console.error("Error al subir foto de parabrisas:", error)
    }
  }

  // Lights Photo
  if (datos.lightsPhoto) {
    try {
      const url = await uploadFileToStorage(datos.lightsPhoto)
      formData.append("lightsPhotoUrl", url)
      // Añadir URL directamente para facilitar el uso en Zapier
      formData.append("lightsPhoto_file_url", url)
      fileUploads.push({
        name: "Lights",
        url,
        type: "image",
        originalName: datos.lightsPhoto.name,
      })
    } catch (error) {
      console.error("Error al subir foto de luces:", error)
    }
  }

  // Tires Photo
  if (datos.tiresPhoto) {
    try {
      const url = await uploadFileToStorage(datos.tiresPhoto)
      formData.append("tiresPhotoUrl", url)
      // Añadir URL directamente para facilitar el uso en Zapier
      formData.append("tiresPhoto_file_url", url)
      fileUploads.push({
        name: "Tires",
        url,
        type: "image",
        originalName: datos.tiresPhoto.name,
      })
    } catch (error) {
      console.error("Error al subir foto de neumáticos:", error)
    }
  }

  // Video File
  if (datos.videoFile) {
    try {
      const url = await uploadFileToStorage(datos.videoFile)
      formData.append("videoFileUrl", url)
      // Añadir URL directamente para facilitar el uso en Zapier
      formData.append("videoFile_file_url", url)
      fileUploads.push({
        name: "Video",
        url,
        type: "video",
        originalName: datos.videoFile.name,
      })
    } catch (error) {
      console.error("Error al subir video:", error)
    }
  }

  // Añadir lista de archivos como JSON
  formData.append("fileUploads", JSON.stringify(fileUploads))

  // Añadir metadatos adicionales
  formData.append("submissionDate", new Date().toISOString())
  formData.append("source", "Inspección Virtual")

  return formData
}

/**
 * Versión alternativa que envía los datos como JSON en lugar de FormData
 * Útil cuando hay problemas con el envío de archivos
 */
// Modificar la función enviarDatosComoJsonAZapier para incluir los archivos como base64
export async function enviarDatosComoJsonAZapier(datos: any) {
  try {
    console.log("Enviando datos JSON a través de la API interna")

    // Preparar los datos para incluir archivos como base64
    const datosJson: any = {
      // Información personal y del vehículo (mantener igual)
      ownerName: datos.ownerName || "",
      email: datos.email || "",
      phone: datos.phone || "",
      licensePlate: datos.licensePlate || "",
      currentKm: datos.currentKm || "",
      modelYear: datos.modelYear || "",
      hasChassisNumber: datos.hasChassisNumber || "",
      hasSecondKey: datos.hasSecondKey || "",
      vehicleConditions: Array.isArray(datos.vehicleConditions) ? datos.vehicleConditions.join(", ") : "",
      safetyItems: Array.isArray(datos.safetyItems) ? datos.safetyItems.join(", ") : "",
      hasAirConditioner: datos.hasAirConditioner || "",
      hasWindshieldDamage: datos.hasWindshieldDamage || "",
      hasLightsDamage: datos.hasLightsDamage || "",
      hasTiresDamage: datos.hasTiresDamage || "",
      hasOriginalSoundSystem: datos.hasOriginalSoundSystem || "",

      // Metadatos
      submissionDate: new Date().toISOString(),
      source: "Inspección Virtual",

      // Archivos como base64
      files_base64: {},
    }

    // Convertir archivos a base64 e incluirlos directamente
    if (datos.crlvPhoto) {
      try {
        const base64 = await fileToBase64(datos.crlvPhoto)
        datosJson.files_base64.crlv = {
          name: `crlv_${datos.licensePlate}.jpg`,
          content: base64,
          type: datos.crlvPhoto.type,
        }
      } catch (error) {
        console.error("Error al convertir CRLV a base64:", error)
      }
    }

    if (datos.videoFile) {
      try {
        const base64 = await fileToBase64(datos.videoFile)
        datosJson.files_base64.video = {
          name: `video_${datos.licensePlate}.mp4`,
          content: base64,
          type: datos.videoFile.type,
        }
      } catch (error) {
        console.error("Error al convertir video a base64:", error)
      }
    }

    // Añadir otros archivos si existen...
    // (código similar para safetyItemsPhoto, windshieldPhoto, etc.)
    if (datos.safetyItemsPhoto) {
      try {
        const base64 = await fileToBase64(datos.safetyItemsPhoto)
        datosJson.files_base64.safetyItems = {
          name: `safetyItems_${datos.licensePlate}.jpg`,
          content: base64,
          type: datos.safetyItemsPhoto.type,
        }
      } catch (error) {
        console.error("Error al convertir safetyItemsPhoto a base64:", error)
      }
    }

    if (datos.windshieldPhoto) {
      try {
        const base64 = await fileToBase64(datos.windshieldPhoto)
        datosJson.files_base64.windshield = {
          name: `windshield_${datos.licensePlate}.jpg`,
          content: base64,
          type: datos.windshieldPhoto.type,
        }
      } catch (error) {
        console.error("Error al convertir windshieldPhoto a base64:", error)
      }
    }

    if (datos.lightsPhoto) {
      try {
        const base64 = await fileToBase64(datos.lightsPhoto)
        datosJson.files_base64.lights = {
          name: `lights_${datos.licensePlate}.jpg`,
          content: base64,
          type: datos.lightsPhoto.type,
        }
      } catch (error) {
        console.error("Error al convertir lightsPhoto a base64:", error)
      }
    }

    if (datos.tiresPhoto) {
      try {
        const base64 = await fileToBase64(datos.tiresPhoto)
        datosJson.files_base64.tires = {
          name: `tires_${datos.licensePlate}.jpg`,
          content: base64,
          type: datos.tiresPhoto.type,
        }
      } catch (error) {
        console.error("Error al convertir tiresPhoto a base64:", error)
      }
    }

    // Enviar los datos a nuestra API interna
    const response = await fetch("/api/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosJson),
    })

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error en la respuesta de la API:", errorText)
      throw new Error(`Error al enviar datos: ${response.status} ${response.statusText}`)
    }

    const responseData = await response.json()
    console.log("Respuesta de la API:", responseData)

    // Devolver el resultado
    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error al enviar datos JSON:", error)
    throw error
  }
}

/**
 * Función para comprimir imágenes antes de enviarlas
 * @param file Archivo de imagen a comprimir
 * @param maxWidth Ancho máximo de la imagen comprimida
 * @param quality Calidad de la imagen comprimida (0-1)
 * @returns Promesa que resuelve a un objeto File con la imagen comprimida
 */
export async function comprimirImagen(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    // Verificar si es una imagen
    if (!file.type.startsWith("image/")) {
      resolve(file) // No es una imagen, devolver el archivo original
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        // Calcular las nuevas dimensiones
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        // Crear un canvas para la compresión
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("No se pudo crear el contexto del canvas"))
          return
        }

        // Dibujar la imagen en el canvas
        ctx.drawImage(img, 0, 0, width, height)

        // Convertir el canvas a Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("No se pudo comprimir la imagen"))
              return
            }

            // Crear un nuevo archivo con la imagen comprimida
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })

            console.log(`Imagen comprimida: ${file.size} bytes -> ${compressedFile.size} bytes`)
            resolve(compressedFile)
          },
          file.type,
          quality,
        )
      }
      img.onerror = () => {
        reject(new Error("Error al cargar la imagen"))
      }
    }
    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"))
    }
  })
}

/**
 * Función para comprimir un video antes de enviarlo
 * @param file Archivo de video a comprimir
 * @returns Promesa que resuelve a un objeto File con el video comprimido
 */
export async function comprimirVideo(file: File): Promise<File> {
  // Esta es una función simulada, ya que la compresión de video en el navegador es limitada
  // En un entorno real, se recomendaría usar un servicio de backend para la compresión de video
  console.log("Simulando compresión de video:", file.name)

  // Devolver el archivo original por ahora
  return file
}

/**
 * Función para comprimir todos los archivos de un formulario
 * @param formData FormData con los archivos a comprimir
 * @returns FormData con los archivos comprimidos
 */
export async function comprimirArchivos(formData: FormData): Promise<FormData> {
  const newFormData = new FormData()

  // Copiar todos los campos que no son archivos
  for (const [key, value] of formData.entries()) {
    if (!(value instanceof File)) {
      newFormData.append(key, value)
      continue
    }

    // Comprimir archivos según su tipo
    try {
      if (value.type.startsWith("image/")) {
        const compressedFile = await comprimirImagen(value)
        newFormData.append(key, compressedFile)
      } else if (value.type.startsWith("video/")) {
        const compressedFile = await comprimirVideo(value)
        newFormData.append(key, compressedFile)
      } else {
        // Otros tipos de archivos
        newFormData.append(key, value)
      }
    } catch (error) {
      console.error(`Error al comprimir el archivo ${key}:`, error)
      // Si hay un error, usar el archivo original
      newFormData.append(key, value)
    }
  }

  return newFormData
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64String = reader.result as string
      resolve(base64String.split(",")[1]) // Remove data URL prefix
    }
    reader.onerror = (error) => reject(error)
  })
}
