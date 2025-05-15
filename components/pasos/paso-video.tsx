"use client"

import { type FormikProps, Form } from "formik"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowRight, ArrowLeft, ExternalLink } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface PasoVideoProps {
  formik: FormikProps<any>
  onPrevious: () => void
  actualizarDatos: (datos: any) => void
}

export default function PasoVideo({ formik, onPrevious, actualizarDatos }: PasoVideoProps) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="bg-black text-white p-6">
        <CardTitle className="text-2xl font-bold">📹 Vídeo do Veículo</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form className="space-y-6">
          <div className="space-y-4">
            <div className="border rounded-md overflow-hidden">
              <div className="p-4 bg-gray-50">
                <h3 className="font-medium mb-4">Instruções para gravação do vídeo</h3>

                <div className="space-y-4">
                  <p>
                    Para uma avaliação completa do seu veículo, precisamos de um vídeo que mostre todos os detalhes
                    importantes. Siga estas instruções:
                  </p>

                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <strong>Prepare o veículo:</strong> Estacione em um local bem iluminado e com espaço para caminhar
                      ao redor do veículo.
                    </li>
                    <li>
                      <strong>Exterior:</strong> Comece gravando a parte frontal do veículo e caminhe lentamente ao
                      redor, mostrando todos os lados (frente, lateral direita, traseira, lateral esquerda).
                    </li>
                    <li>
                      <strong>Detalhes externos:</strong> Aproxime a câmera para mostrar detalhes como faróis,
                      lanternas, rodas, pneus e qualquer dano visível.
                    </li>
                    <li>
                      <strong>Interior:</strong> Mostre o interior do veículo, incluindo bancos, painel, volante,
                      console central e teto.
                    </li>
                    <li>
                      <strong>Porta-malas:</strong> Abra o porta-malas e mostre seu interior e capacidade.
                    </li>
                    <li>
                      <strong>Motor:</strong> Abra o capô e mostre o compartimento do motor.
                    </li>
                  </ol>

                  <div className="my-4">
                    <Image
                      src="/images/instrucciones-video.png"
                      alt="Guia de gravação: Vuelta de Video e Visibilidad del Tablero"
                      width={800}
                      height={300}
                      className="w-full rounded-md border"
                    />
                  </div>

                  <p>O vídeo deve ter entre 1 e 3 minutos de duração e não exceder 2GB de tamanho.</p>

                  <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-200">
                    <p className="text-blue-800 mb-2 font-medium">Vídeo de exemplo</p>
                    <p className="text-blue-700 mb-2">
                      Assista a um vídeo de exemplo para entender como gravar corretamente:
                    </p>
                    <a
                      href="https://kavak.com.br/video-modelo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Assistir vídeo de exemplo
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                Grave um vídeo de 360° do exterior e interior do veículo seguindo as instruções acima. O vídeo é
                essencial para a avaliação completa do seu veículo.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <FileUpload
                accept={{
                  "video/*": [".mp4", ".mov", ".avi", ".webm"],
                }}
                maxSize={2 * 1024 * 1024 * 1024} // 2GB
                onFileChange={(file) => {
                  if (file) {
                    const objectUrl = URL.createObjectURL(file)
                    formik.setFieldValue("videoFile", file)
                    formik.setFieldValue("videoFileUrl", objectUrl)
                    // Validar el formulario después de cambiar el valor
                    formik.validateForm().then(() => {
                      formik.setTouched({
                        ...formik.touched,
                        videoFile: true,
                      })
                    })
                  } else {
                    formik.setFieldValue("videoFile", null)
                    formik.setFieldValue("videoFileUrl", "")
                  }
                }}
                value={formik.values.videoFile}
                previewUrl={formik.values.videoFileUrl}
                error={
                  formik.touched.videoFile && formik.errors.videoFile ? String(formik.errors.videoFile) : undefined
                }
                fileType="video"
                label="Clique para fazer upload do vídeo do veículo"
              />
              {formik.touched.videoFile && formik.errors.videoFile && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formik.errors.videoFile}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 flex justify-between">
            <Button type="button" variant="outline" onClick={onPrevious}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? (
                "Processando..."
              ) : (
                <>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
