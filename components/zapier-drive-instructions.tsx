import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

export default function ZapierDriveInstructions() {
  return (
    <div className="space-y-6 p-2">
      <Alert variant="info" className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-800">Configuración de Zapier para Google Drive</AlertTitle>
        <AlertDescription className="text-blue-700">
          Siga estas instrucciones para configurar correctamente Zapier para subir archivos a Google Drive.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Solución para archivos en formato de texto</h3>
        <div className="bg-green-50 p-4 rounded-md border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">Nueva solución implementada: Archivos en Base64</h4>
          <p className="text-green-700 mb-2">
            Hemos implementado una nueva solución que envía los archivos directamente en formato Base64. Esto elimina la
            necesidad de URLs públicas y debería resolver los problemas de acceso a archivos.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-green-700">
            <li>
              <strong>Configuración en Zapier:</strong> Use "Code by Zapier" para procesar el contenido Base64 y luego
              "Create File" en Google Drive.
            </li>
            <li>
              <strong>Campos disponibles:</strong> Para cada archivo, tendrá disponibles los campos:
              <ul className="list-disc pl-5 mt-1">
                <li>
                  <code className="bg-green-100 px-1 rounded">crlv_file_content</code> - Contenido Base64 del archivo
                  CRLV
                </li>
                <li>
                  <code className="bg-green-100 px-1 rounded">crlv_file_name</code> - Nombre del archivo CRLV
                </li>
                <li>
                  <code className="bg-green-100 px-1 rounded">crlv_file_type</code> - Tipo MIME del archivo CRLV
                </li>
                <li>Y campos similares para otros archivos (video, fotos, etc.)</li>
              </ul>
            </li>
            <li>
              <strong>Pruebe con un nuevo envío:</strong> Complete el formulario nuevamente para probar la nueva
              solución.
            </li>
          </ol>
        </div>

        <h3 className="text-lg font-medium mt-6">Configuración paso a paso</h3>

        <div className="border rounded-md overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <h4 className="font-medium">1. Configurar el Trigger (Webhook)</h4>
          </div>
          <div className="p-4 space-y-2">
            <p>Comience con un trigger de Webhook para recibir los datos del formulario:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Seleccione "Webhooks by Zapier" como la app</li>
              <li>Seleccione "Catch Hook" como el evento</li>
              <li>Configure el webhook y copie la URL generada</li>
              <li>Pegue esta URL en la configuración de su aplicación</li>
            </ul>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <h4 className="font-medium">2. Configurar Google Drive para CRLV</h4>
          </div>
          <div className="p-4 space-y-2">
            <p>Añada un paso para subir la foto del CRLV a Google Drive:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Seleccione "Google Drive" como la app</li>
              <li>Seleccione "Upload File from URL" como el evento</li>
              <li>
                Configure los campos:
                <ul className="list-disc pl-5 mt-1">
                  <li>
                    <strong>Drive:</strong> Seleccione su Google Drive
                  </li>
                  <li>
                    <strong>Folder:</strong> Seleccione la carpeta donde desea guardar los archivos
                  </li>
                  <li>
                    <strong>URL:</strong> Seleccione el campo{" "}
                    <code className="bg-gray-100 px-1 rounded">crlvPhoto_file_url</code>
                  </li>
                  <li>
                    <strong>File Name:</strong>{" "}
                    <code className="bg-gray-100 px-1 rounded">CRLV-{{ licensePlate }}.jpg</code>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="bg-blue-50 p-3 rounded mt-2">
              <p className="text-blue-700 text-sm">
                <strong>Importante:</strong> Asegúrese de usar "Upload File from URL" y no "Upload File".
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <h4 className="font-medium">3. Configurar Google Drive para Video</h4>
          </div>
          <div className="p-4 space-y-2">
            <p>Añada otro paso para subir el video a Google Drive:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Seleccione "Google Drive" como la app</li>
              <li>Seleccione "Upload File from URL" como el evento</li>
              <li>
                Configure los campos:
                <ul className="list-disc pl-5 mt-1">
                  <li>
                    <strong>Drive:</strong> Seleccione su Google Drive
                  </li>
                  <li>
                    <strong>Folder:</strong> Seleccione la carpeta donde desea guardar los archivos
                  </li>
                  <li>
                    <strong>URL:</strong> Seleccione el campo{" "}
                    <code className="bg-gray-100 px-1 rounded">videoFile_file_url</code>
                  </li>
                  <li>
                    <strong>File Name:</strong>{" "}
                    <code className="bg-gray-100 px-1 rounded">Video-{{ licensePlate }}.mp4</code>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <h4 className="font-medium">4. Configurar Google Sheets (opcional)</h4>
          </div>
          <div className="p-4 space-y-2">
            <p>Añada un paso para guardar los datos en Google Sheets:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Seleccione "Google Sheets" como la app</li>
              <li>Seleccione "Create Spreadsheet Row" como el evento</li>
              <li>
                Configure los campos:
                <ul className="list-disc pl-5 mt-1">
                  <li>
                    <strong>Drive:</strong> Seleccione su Google Drive
                  </li>
                  <li>
                    <strong>Spreadsheet:</strong> Seleccione su hoja de cálculo
                  </li>
                  <li>
                    <strong>Worksheet:</strong> Seleccione la hoja donde desea guardar los datos
                  </li>
                  <li>
                    <strong>Columns:</strong> Mapee los campos del formulario a las columnas de la hoja
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <Alert variant="warning" className="bg-yellow-50 border-yellow-200 mt-6">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Importante</AlertTitle>
          <AlertDescription className="text-yellow-700">
            <p className="mb-2">Si sigue teniendo problemas con los archivos, intente estas soluciones adicionales:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verifique que los archivos no sean demasiado grandes (límite recomendado: 10MB)</li>
              <li>
                Pruebe abrir las URLs de los archivos directamente en su navegador para verificar que son accesibles
              </li>
              <li>Asegúrese de usar "Upload File from URL" en Google Drive y no "Upload File" o "Create File"</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
