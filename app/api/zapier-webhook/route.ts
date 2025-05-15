import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Verificar si es una solicitud multipart/form-data o JSON
    const contentType = request.headers.get("content-type") || ""

    let data: any = {}

    if (contentType.includes("multipart/form-data")) {
      // Procesar form-data
      const formData = await request.formData()

      // Convertir FormData a objeto
      formData.forEach((value, key) => {
        // Si es un archivo, solo guardamos el nombre
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
    } else {
      // Procesar JSON
      data = await request.json()
    }

    // Aquí puedes procesar los datos antes de enviarlos a Zapier
    // Por ejemplo, validar, transformar, etc.

    // Enviar a Zapier
    const zapierWebhookUrl = process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL

    if (!zapierWebhookUrl) {
      return NextResponse.json({ error: "URL del webhook de Zapier no configurada" }, { status: 500 })
    }

    const zapierResponse = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!zapierResponse.ok) {
      throw new Error(`Error al enviar a Zapier: ${zapierResponse.status} ${zapierResponse.statusText}`)
    }

    const zapierResult = await zapierResponse.json()

    return NextResponse.json({
      success: true,
      message: "Datos enviados a Zapier correctamente",
      zapierResponse: zapierResult,
    })
  } catch (error: any) {
    console.error("Error en el webhook de Zapier:", error)

    return NextResponse.json(
      {
        error: "Error al procesar la solicitud",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
