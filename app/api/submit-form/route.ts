import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("Recibida solicitud en /api/submit-form")

    // Verificar si es una solicitud multipart/form-data o JSON
    const contentType = request.headers.get("content-type") || ""
    let data: any = {}

    if (contentType.includes("multipart/form-data")) {
      // Procesar form-data
      const formData = await request.formData()

      // Convertir FormData a objeto para enviar a Zapier
      formData.forEach((value, key) => {
        // Si es un archivo, solo guardamos información básica
        if (value instanceof File) {
          data[key] = {
            name: value.name,
            type: value.type,
            size: value.size,
          }
        } else {
          data[key] = value
        }
      })

      // Mantener el FormData original para posibles usos futuros
      data._formData = Object.fromEntries(formData)
    } else {
      // Procesar JSON
      data = await request.json()

      // Si hay archivos en base64, procesarlos para Zapier
      if (data.files_base64) {
        // Extraer los archivos base64 y añadirlos como campos separados para Zapier
        Object.entries(data.files_base64).forEach(([key, fileData]: [string, any]) => {
          // Crear un campo específico para cada archivo con su contenido base64
          // Zapier puede usar estos campos para crear archivos
          data[`${key}_file_content`] = fileData.content
          data[`${key}_file_name`] = fileData.name
          data[`${key}_file_type`] = fileData.type
        })
      }
    }

    // Enviar a Zapier
    const zapierWebhookUrl = process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL

    if (!zapierWebhookUrl) {
      console.error("URL del webhook de Zapier no configurada")
      return NextResponse.json({ error: "URL del webhook de Zapier no configurada" }, { status: 500 })
    }

    console.log("Enviando datos a Zapier:", zapierWebhookUrl)

    // Enviar los datos a Zapier
    const zapierResponse = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!zapierResponse.ok) {
      const errorText = await zapierResponse.text()
      console.error("Error en la respuesta de Zapier:", errorText)
      throw new Error(`Error al enviar a Zapier: ${zapierResponse.status} ${zapierResponse.statusText}`)
    }

    let zapierResult
    try {
      zapierResult = await zapierResponse.json()
      console.log("Respuesta de Zapier:", zapierResult)
    } catch (e) {
      console.log("No se pudo parsear la respuesta de Zapier como JSON, pero la solicitud fue exitosa")
      zapierResult = { success: true, message: "Datos recibidos por Zapier" }
    }

    return NextResponse.json({
      success: true,
      message: "Datos enviados a Zapier correctamente",
      zapierResponse: zapierResult,
    })
  } catch (error: any) {
    console.error("Error en submit-form:", error)

    return NextResponse.json(
      {
        error: "Error al procesar la solicitud",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
