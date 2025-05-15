import { type NextRequest, NextResponse } from "next/server"

// Variables para la configuración de Google Drive
// Estos valores deben configurarse como variables de entorno
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID
const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY
const GOOGLE_DRIVE_ACCESS_TOKEN = process.env.GOOGLE_DRIVE_ACCESS_TOKEN

export async function POST(request: NextRequest) {
  try {
    console.log("Recibida solicitud en /api/drive-upload")

    // Verificar si las variables de entorno están configuradas
    if (!GOOGLE_DRIVE_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Token de acceso a Google Drive no configurado" },
        { status: 500 }
      )
    }

    if (!GOOGLE_DRIVE_FOLDER_ID) {
      return NextResponse.json(
        { error: "ID de la carpeta de Google Drive no configurado" },
        { status: 500 }
      )
    }

    // Analizar datos de la solicitud
    const data = await request.json()
    const { email, licensePlate, files_base64 } = data
    
    if (!email || !licensePlate) {
      return NextResponse.json(
        { error: "Se requiere email y placa para crear la carpeta" },
        { status: 400 }
      )
    }

    // 1. Crear carpeta del cliente
    const folderName = `${email} - ${licensePlate}`;
    const clientFolder = await createFolder(folderName, GOOGLE_DRIVE_FOLDER_ID);
    
    // 2. Subir archivos a la carpeta del cliente
    const uploadResults = []
    
    if (files_base64) {
      for (const [key, fileData] of Object.entries(files_base64)) {
        try {
          if (typeof fileData === 'object' && fileData && 'content' in fileData && 'name' in fileData) {
            // Convertir base64 a buffer y subir
            const content = Buffer.from(fileData.content as string, 'base64')
            const uploadResult = await uploadFileToDrive({
              name: fileData.name as string,
              mimeType: (fileData.type as string) || 'application/octet-stream',
              content,
              field: key
            }, clientFolder.id)
            
            uploadResults.push({
              field: key,
              fileName: fileData.name,
              fileId: uploadResult.id,
              webViewLink: uploadResult.webViewLink
            })
          }
        } catch (error: any) {
          console.error(`Error al subir ${key}:`, error)
          uploadResults.push({
            field: key, 
            error: error.message || "Error desconocido"
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      folderLink: clientFolder.webViewLink,
      folderId: clientFolder.id,
      uploadResults
    })
    
  } catch (error: any) {
    console.error("Error en drive-upload:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud", message: error.message },
      { status: 500 }
    )
  }
}

// Función para crear una carpeta en Google Drive
async function createFolder(name: string, parentId: string) {
  const response = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,webViewLink', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GOOGLE_DRIVE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId]
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Error al crear carpeta: ${response.status} - ${error}`)
  }
  
  return await response.json()
}

// Función para subir un archivo a la carpeta del cliente
async function uploadFileToDrive(fileData: {
  name: string, 
  mimeType: string, 
  content: Buffer,
  field: string
}, folderId: string) {
  const { name, mimeType, content } = fileData
  const boundary = "-------" + Math.random().toString(36).substring(2)
  
  const body = [
    `--${boundary}`,
    'Content-Type: application/json',
    '',
    JSON.stringify({
      name: name,
      parents: [folderId]
    }),
    `--${boundary}`,
    `Content-Type: ${mimeType}`,
    '',
    content,
    `--${boundary}--`
  ].join('\r\n')
  
  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,thumbnailLink', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GOOGLE_DRIVE_ACCESS_TOKEN}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      'Content-Length': body.length.toString()
    },
    body: body
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al subir a Google Drive: ${response.status} - ${errorText}`)
  }
  
  return await response.json()
} 