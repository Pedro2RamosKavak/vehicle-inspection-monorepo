import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function ZapierBase64Instructions() {
  return (
    <div className="space-y-6 p-4 bg-white rounded-lg border">
      <Alert variant="info" className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-800">Configuración de Zapier para archivos Base64</AlertTitle>
        <AlertDescription className="text-blue-700">
          Instrucciones mejoradas para configurar Zapier para recibir y procesar archivos en formato Base64.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configuración paso a paso</h3>

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
              <li>Pegue esta URL en la configuración del proyecto como <code>NEXT_PUBLIC_ZAPIER_WEBHOOK_URL</code></li>
            </ul>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <h4 className="font-medium">2. Usar Code by Zapier para procesar Base64</h4>
          </div>
          <div className="p-4 space-y-2">
            <p>Añada un paso de "Code by Zapier" para convertir el contenido Base64 a un archivo:</p>
            <div className="bg-gray-100 p-3 rounded mt-2 overflow-auto">
              <pre className="text-xs">
                <code>
                  {`// Ejemplo para procesar un archivo CRLV en base64
const base64Content = inputData.crlv_file_content;
const fileName = inputData.crlv_file_name || 'crlv.jpg';
const fileType = inputData.crlv_file_type || 'image/jpeg';

// Devolver el contenido base64 y metadatos del archivo
return {
  fileContent: base64Content,
  fileName: fileName,
  fileType: fileType
};`}
                </code>
              </pre>
            </div>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <h4 className="font-medium">3. Configurar Google Drive para crear archivo desde Base64</h4>
          </div>
          <div className="p-4 space-y-2">
            <p>Añada un paso de "Google Drive" para crear un archivo a partir del contenido Base64:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Seleccione "Google Drive" como la app</li>
              <li>Seleccione "Create File" como el evento (no "Upload File")</li>
              <li>
                Configure los campos:
                <ul className="list-disc pl-5 mt-1">
                  <li>
                    <strong>Drive:</strong> Seleccione su Google Drive
                  </li>
                  <li>
                    <strong>Folder:</strong> Seleccione la carpeta donde desea guardar los archivos (18mfjOiDvyO1xkI0nXaYJNYVPohfeHaeV)
                  </li>
                  <li>
                    <strong>File Content:</strong> Seleccione el campo <code>fileContent</code> del paso de Code
                  </li>
                  <li>
                    <strong>File Name:</strong> Seleccione el campo <code>fileName</code> del paso de Code
                  </li>
                  <li>
                    <strong>Convert File:</strong> No
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <h4 className="font-medium">4. Repetir para cada archivo</h4>
          </div>
          <div className="p-4 space-y-2">
            <p>Repita los pasos 2 y 3 para cada archivo que desee procesar:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                CRLV: use <code>crlv_file_content</code>, <code>crlv_file_name</code>, <code>crlv_file_type</code>
              </li>
              <li>
                Video: use <code>video_file_content</code>, <code>video_file_name</code>, <code>video_file_type</code>
              </li>
              <li>
                Otros archivos: use los campos correspondientes que reciba en formato <code>[nombre]_file_content</code>
              </li>
            </ul>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <h4 className="font-medium">5. Guardar en Google Sheets</h4>
          </div>
          <div className="p-4 space-y-2">
            <p>Finalmente, añada un paso para guardar los datos en Google Sheets:</p>
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
                    <strong>Spreadsheet:</strong> Seleccione la hoja de cálculo (1vEI_R43cQcqShLA_63IgJ01hvI5wYDN28Ged3dHNkzY)
                  </li>
                  <li>
                    <strong>Worksheet:</strong> Seleccione "Respuestas"
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
          <Info className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Importante</AlertTitle>
          <AlertDescription className="text-yellow-700">
            <p className="mb-2">Tenga en cuenta estas consideraciones al trabajar con archivos Base64:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Para videos grandes, es posible que necesite aumentar los límites de tiempo de ejecución en Zapier</li>
              <li>Se recomienda crear una carpeta por cliente concatenando el email y la placa de licencia</li>
              <li>No olvide probar completamente su Zap antes de usar en producción</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
