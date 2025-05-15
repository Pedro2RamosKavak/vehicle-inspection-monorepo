import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, ExternalLink, FileImage, FileVideo } from "lucide-react"

export default function ZapierInstructions() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Configuración de Zapier para Archivos</CardTitle>
        <CardDescription>
          Instrucciones para configurar Zapier para recibir y procesar archivos de la inspección
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Zapier no puede recibir archivos directamente a través de webhooks. Esta guía muestra cómo configurar Zapier
            para recibir URLs de archivos y procesarlos.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="webhook">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="webhook">1. Webhook</TabsTrigger>
            <TabsTrigger value="gdrive">2. Google Drive</TabsTrigger>
            <TabsTrigger value="sheets">3. Google Sheets</TabsTrigger>
          </TabsList>
          <TabsContent value="webhook" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Configuración del Webhook</h3>
              <p>
                El webhook de Zapier recibirá datos JSON que incluyen URLs de archivos en lugar de los archivos
                directamente.
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>En Zapier, crea un nuevo Zap y selecciona "Webhook" como trigger.</li>
                <li>Selecciona "Catch Hook" como evento.</li>
                <li>Copia la URL del webhook y configúrala en las variables de entorno de tu aplicación.</li>
                <li>
                  En el paso de prueba, verás que los datos incluyen un campo <code>fileUploads</code> que contiene un
                  array de objetos con las URLs de los archivos.
                </li>
              </ol>
              <div className="bg-gray-100 p-3 rounded-md">
                <p className="font-medium">Ejemplo de datos recibidos:</p>
                <pre className="text-xs overflow-auto p-2">
                  {`{
  "ownerName": "João Silva",
  "email": "joao@example.com",
  "fileUploads": [
    { "name": "CRLV", "url": "https://storage.example.com/crlv-123.jpg" },
    { "name": "Video", "url": "https://storage.example.com/video-123.mp4" }
  ]
}`}
                </pre>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="gdrive" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Configuración de Google Drive</h3>
              <p>
                Para guardar los archivos en Google Drive, necesitarás configurar un paso adicional en tu Zap que
                descargue los archivos de las URLs.
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Después del webhook, añade un paso de "Code by Zapier".</li>
                <li>
                  Usa JavaScript para iterar sobre el array <code>fileUploads</code> y preparar los datos para Google
                  Drive.
                </li>
                <li>Añade un paso de "Google Drive" y selecciona "Upload File".</li>
                <li>
                  Configura el paso para usar la URL del archivo como "File" (selecciona "Custom" y usa la URL del paso
                  anterior).
                </li>
                <li>Especifica la carpeta de destino en Google Drive.</li>
              </ol>
              <div className="bg-gray-100 p-3 rounded-md">
                <p className="font-medium">Ejemplo de código para Code by Zapier:</p>
                <pre className="text-xs overflow-auto p-2">
                  {`// Procesar el primer archivo (puedes repetir este paso para cada archivo)
const fileUploads = inputData.fileUploads;
const firstFile = fileUploads[0];

return {
  fileUrl: firstFile.url,
  fileName: firstFile.name + '.jpg', // Añadir extensión apropiada
  folderId: 'TU_ID_DE_CARPETA_EN_GOOGLE_DRIVE'
};`}
                </pre>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="sheets" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Configuración de Google Sheets</h3>
              <p>Para guardar los datos en Google Sheets, incluyendo las URLs de los archivos, sigue estos pasos:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Después del webhook, añade un paso de "Google Sheets".</li>
                <li>Selecciona "Create Spreadsheet Row" como acción.</li>
                <li>Selecciona o crea una hoja de cálculo y una hoja específica.</li>
                <li>
                  Mapea los campos del webhook a las columnas de la hoja, incluyendo las URLs de los archivos del campo{" "}
                  <code>fileUploads</code>.
                </li>
              </ol>
              <div className="bg-gray-100 p-3 rounded-md">
                <p className="font-medium">Estructura recomendada para la hoja de cálculo:</p>
                <table className="text-xs w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-1">ID</th>
                      <th className="border p-1">Fecha</th>
                      <th className="border p-1">Nombre</th>
                      <th className="border p-1">Email</th>
                      <th className="border p-1">URL CRLV</th>
                      <th className="border p-1">URL Video</th>
                      <th className="border p-1">Otros datos...</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-1">1</td>
                      <td className="border p-1">2023-05-15</td>
                      <td className="border p-1">João Silva</td>
                      <td className="border p-1">joao@example.com</td>
                      <td className="border p-1">https://storage.example.com/crlv-123.jpg</td>
                      <td className="border p-1">https://storage.example.com/video-123.mp4</td>
                      <td className="border p-1">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center space-x-2">
            <FileImage className="h-5 w-5 text-blue-600" />
            <FileVideo className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">
              Los archivos se envían como URLs para compatibilidad con Zapier
            </span>
          </div>
          <Button variant="outline" size="sm" className="flex items-center" asChild>
            <a
              href="https://zapier.com/help/create/code-webhooks/use-webhooks-in-zaps"
              target="_blank"
              rel="noreferrer noopener"
            >
              Documentación de Zapier
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
