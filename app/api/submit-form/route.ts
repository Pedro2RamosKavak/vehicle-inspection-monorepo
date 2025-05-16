import { type NextRequest, NextResponse } from "next/server"
import { saveInspection } from "@/lib/server-storage"

export async function POST(request: NextRequest) {
  console.log("Recibida solicitud en /api/submit-form")
  
  try {
    // Obtener los datos de la solicitud
    const data = await request.json()
    
    // Generar un ID único para la inspección
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 10)
    const inspectionId = `insp_${timestamp}_${randomId}`
    
    // Agregar información adicional a los datos
    const dataWithMetadata = {
      ...data,
      id: inspectionId,
      submissionDate: new Date().toISOString()
    }
    
    // Guardar la inspección en el servidor (pasando un único objeto como espera la función)
    await saveInspection(dataWithMetadata)
    console.log("Inspección guardada en el servidor con ID:", inspectionId)
    
    // Obtener URLs de imágenes (si fueron proporcionadas)
    const crlvImageUrl = data.crlv_image_url || data.crlvPhotoUrl || ""
    const safetyItemsImageUrl = data.safety_items_image_url || data.safetyItemsPhotoUrl || ""
    const windshieldPhotoUrl = data.windshieldPhotoUrl || ""
    const lightsPhotoUrl = data.lightsPhotoUrl || ""
    const tiresPhotoUrl = data.tiresPhotoUrl || ""
    const videoFileUrl = data.videoFileUrl || ""
    
    console.log("URLs de imágenes recibidas:", {
      crlv_image_url: crlvImageUrl,
      safety_items_image_url: safetyItemsImageUrl,
      windshield_photo_url: windshieldPhotoUrl,
      lights_photo_url: lightsPhotoUrl,
      tires_photo_url: tiresPhotoUrl,
      video_file_url: videoFileUrl
    })
    
    // Solo mostrar las claves para debugging
    console.log("Datos a enviar a Zapier:", Object.keys(data))
    
    // Enviar datos a Zapier si está configurado
    let zapierResult = {}
    const webhookUrl = process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL
    
    if (!webhookUrl) {
      console.error("URL del webhook de Zapier no configurada")
    } else {
      console.log(`Enviando datos a Zapier: ${webhookUrl}`)
      
      // Realizar la petición a Zapier
      const zapierResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      
      if (!zapierResponse.ok) {
        const errorText = await zapierResponse.text()
        console.error("Error en la respuesta de Zapier:", errorText)
        throw new Error(`Error al enviar a Zapier: ${zapierResponse.status} ${zapierResponse.statusText}`)
      }
      
      // Obtener y mostrar la respuesta de Zapier
      zapierResult = await zapierResponse.json()
      console.log("Respuesta de Zapier:", zapierResult)
    }
    
    // Crear un objeto con los datos de la inspección incluyendo todas las URLs
    const inspectionData = {
      id: inspectionId,
      titular: data.titular || data.ownerName || 'Sin nombre',
      placa: data.placa || data.licensePlate || 'Sin placa',
      email: data.email || 'Sin email',
      submissionDate: new Date().toISOString(),
      // Incluir URLs de imágenes y video
      crlvPhotoUrl: crlvImageUrl,
      safetyItemsPhotoUrl: safetyItemsImageUrl,
      windshieldPhotoUrl: windshieldPhotoUrl,
      lightsPhotoUrl: lightsPhotoUrl,
      tiresPhotoUrl: tiresPhotoUrl,
      videoFileUrl: videoFileUrl
    }
    
    // Devolver una respuesta exitosa con información relevante
    // Incluimos instrucción para almacenar en localStorage
    return NextResponse.json({
      success: true,
      inspectionId,
      zapierResult,
      storeInLocalStorage: true, // Bandera para indicar al cliente que guarde localmente
      inspectionData
    })
    
  } catch (error: any) {
    console.error("Error en submit-form:", error)
    
    // Devolver error
    return NextResponse.json(
      { 
        success: false, 
        error: "Error al procesar la solicitud", 
        message: error.message,
      },
      { status: 500 }
    )
  }
}
