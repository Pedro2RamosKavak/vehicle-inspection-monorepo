import { type NextRequest, NextResponse } from "next/server"

// Variables para la configuración de Google Sheets
const GOOGLE_SHEETS_ID = "1vEI_R43cQcqShLA_63IgJ01hvI5wYDN28Ged3dHNkzY"
const GOOGLE_SHEETS_RANGE = "Respuestas!A:Z" // Ajusta según la estructura de tu hoja
const GOOGLE_ACCESS_TOKEN = process.env.GOOGLE_DRIVE_ACCESS_TOKEN // El mismo token para Drive y Sheets

export async function POST(request: NextRequest) {
  try {
    console.log("Recibida solicitud en /api/sheets-update")

    // Verificar token de acceso
    if (!GOOGLE_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Token de acceso a Google Sheets no configurado" },
        { status: 500 }
      )
    }

    // Obtener datos del formulario
    const formData = await request.json()
    
    // Preparar datos para la hoja de cálculo
    // La estructura del array depende de las columnas en tu hoja
    const values = [
      formData.submissionDate || new Date().toISOString(),
      formData.ownerName || "",
      formData.email || "",
      formData.phone || "",
      formData.licensePlate || "",
      formData.currentKm || "",
      formData.modelYear || "",
      formData.vehicleConditions || "",
      formData.hasChassisNumber === "sim" ? "Sí" : "No",
      formData.hasSecondKey === "sim" ? "Sí" : "No",
      formData.safetyItems || "",
      formData.hasAirConditioner === "sim" ? "Sí" : "No",
      formData.hasWindshieldDamage === "sim" ? "Sí" : "No",
      formData.hasLightsDamage === "sim" ? "Sí" : "No",
      formData.hasTiresDamage === "sim" ? "Sí" : "No",
      formData.hasOriginalSoundSystem === "sim" ? "Sí" : "No",
      formData.driveLink || "", // Link a la carpeta en Google Drive
    ]

    // Enviar datos a Google Sheets
    const result = await appendToGoogleSheets(values)

    return NextResponse.json({
      success: true,
      message: "Datos guardados en Google Sheets correctamente",
      result
    })
    
  } catch (error: any) {
    console.error("Error en sheets-update:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud", message: error.message },
      { status: 500 }
    )
  }
}

// Función para añadir datos a Google Sheets
async function appendToGoogleSheets(values: any[]) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/${GOOGLE_SHEETS_RANGE}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GOOGLE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [values]
      })
    }
  )
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Error al guardar en Google Sheets: ${response.status} - ${error}`)
  }
  
  return await response.json()
} 