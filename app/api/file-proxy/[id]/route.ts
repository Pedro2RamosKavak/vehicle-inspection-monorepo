import { type NextRequest, NextResponse } from "next/server"

// Almacenamiento temporal de archivos (en memoria)
// En un entorno de producción, esto debería ser una base de datos o un servicio de almacenamiento
const fileStorage: Record<string, { data: string; type: string; filename: string }> = {}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const fileId = params.id

  // Verificar si el archivo existe
  if (!fileStorage[fileId]) {
    return new NextResponse("Archivo no encontrado", { status: 404 })
  }

  const fileData = fileStorage[fileId]

  // Decodificar el contenido base64
  const binaryData = Buffer.from(fileData.data, "base64")

  // Configurar los encabezados para la descarga del archivo
  const headers = new Headers()
  headers.set("Content-Type", fileData.type)
  headers.set("Content-Disposition", `attachment; filename="${fileData.filename}"`)
  headers.set("Content-Length", binaryData.length.toString())
  headers.set("Cache-Control", "public, max-age=31536000") // Cache por 1 año

  // Devolver el archivo como respuesta
  return new NextResponse(binaryData, {
    status: 200,
    headers,
  })
}

// Función para almacenar un archivo y obtener su ID
export function storeFile(base64Data: string, type: string, filename: string): string {
  const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  fileStorage[fileId] = { data: base64Data, type, filename }
  return fileId
}
