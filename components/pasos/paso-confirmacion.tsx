"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, ArrowLeft, Info, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  enviarDatosAZapier,
  prepararDatosParaZapier,
  enviarDatosComoJsonAZapier,
  comprimirArchivos,
} from "@/lib/zapier-service"

interface PasoConfirmacionProps {
  datosFormulario: any
  onSubmit: () => void
  onPrevious: () => void
  enviando: boolean
  error: string
}

export default function PasoConfirmacion({
  datosFormulario,
  onSubmit,
  onPrevious,
  enviando: propEnviando,
  error: propError,
}: PasoConfirmacionProps) {
  const [enviando, setEnviando] = useState(propEnviando)
  const [error, setError] = useState<string | null>(propError || null)
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState(0)
  const [usarMetodoAlternativo, setUsarMetodoAlternativo] = useState(false)
  const [intentos, setIntentos] = useState(0)
  const [comprimiendo, setComprimiendo] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    // Verificar si hay una URL de webhook configurada
    if (!process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL) {
      console.warn("No se ha configurado la URL del webhook de Zapier")
    }
  }, [])

  const handleSubmit = async () => {
    if (enviando) return

    setEnviando(true)
    setError(null)
    setProgress(10)

    try {
      setProgress(15)
      setComprimiendo(true)

      // Preparar los datos para enviar
      const formDataOriginal = await prepararDatosParaZapier(datosFormulario)

      // Comprimir archivos si es necesario
      let formData;
      try {
        formData = await comprimirArchivos(formDataOriginal)
        setProgress(25)
      } catch (compressionError) {
        console.warn("Error al comprimir archivos:", compressionError)
        formData = formDataOriginal
        setProgress(20)
      }

      setComprimiendo(false)
      setProgress(30)

      // Intentar enviar los datos
      let resultado

      if (usarMetodoAlternativo) {
        // Método alternativo: enviar como JSON (sin archivos)
        setProgress(40)
        resultado = await enviarDatosComoJsonAZapier(datosFormulario)
        setProgress(70)
      } else {
        // Método principal: enviar como FormData (con archivos)
        try {
          setProgress(40)
          resultado = await enviarDatosAZapier(formData)
          setProgress(70)
        } catch (error) {
          console.error("Error al enviar con FormData, intentando método alternativo:", error)
          setUsarMetodoAlternativo(true)
          setProgress(50)
          resultado = await enviarDatosComoJsonAZapier(datosFormulario)
          setProgress(70)
        }
      }

      console.log("Resultado del envío:", resultado)
      setProgress(90)

      // Si llegamos aquí, el envío fue exitoso
      setSuccess(true)
      setProgress(100)

      // Esperar un momento antes de continuar
      setTimeout(() => {
        onSubmit()
      }, 1500)
    } catch (error: any) {
      console.error("Error al enviar la inspección:", error)
      setError(error.message || "Ocorreu um erro ao enviar a inspeção. Por favor, tente novamente.")
      setProgress(0)
      setIntentos(intentos + 1)
    } finally {
      if (!success) {
        setEnviando(false)
        setComprimiendo(false)
      }
    }
  }

  const mapConditionToText = (condition: string): string => {
    const conditionMap: { [key: string]: string } = {
      theft: "Possui histórico de roubo e furto",
      armored: "É blindado",
      gas: "Tem Kit gás (GNV)",
      structural: "Dano estrutural",
      auction: "Já teve passagem por leilão",
      crash: "Já teve batida",
      modified: "Possui modificação na estrutura",
      lowered: "Rebaixado",
      performance: "Possui alguma alteração de performance",
      none: "Nenhuma das opções",
    }
    return conditionMap[condition] || condition
  }

  const mapSafetyItemToText = (item: string): string => {
    const itemMap: { [key: string]: string } = {
      wrench: "Chave de roda",
      spare: "Estepe",
      triangle: "Triângulo",
    }
    return itemMap[item] || item
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="bg-black text-white p-6">
        <CardTitle className="text-2xl font-bold">✅ Revisar e Enviar</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex flex-col">
                <span>{error}</span>
                {intentos > 0 && (
                  <span className="text-sm mt-1">
                    Tentativa {intentos} de 3. {intentos >= 2 ? "Tente usar o método alternativo." : ""}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <h4 className="font-medium">Informações Pessoais</h4>
              </div>
              <div className="divide-y">
                <div className="p-4 flex justify-between">
                  <span className="text-gray-500">Nome do titular:</span>
                  <span className="font-medium">{datosFormulario.ownerName}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{datosFormulario.email}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-gray-500">Celular:</span>
                  <span className="font-medium">{datosFormulario.phone}</span>
                </div>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <h4 className="font-medium">Informações do Veículo</h4>
              </div>
              <div className="divide-y">
                <div className="p-4 flex justify-between">
                  <span className="text-gray-500">Placa:</span>
                  <span className="font-medium">{datosFormulario.licensePlate}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-gray-500">Quilometragem:</span>
                  <span className="font-medium">{datosFormulario.currentKm} km</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-gray-500">Ano do modelo:</span>
                  <span className="font-medium">{datosFormulario.modelYear}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-gray-500">Gravação do chassi nos vidros:</span>
                  <span className="font-medium">{datosFormulario.hasChassisNumber === "sim" ? "Sim" : "Não"}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-gray-500">Segunda chave:</span>
                  <span className="font-medium">{datosFormulario.hasSecondKey === "sim" ? "Sim" : "Não"}</span>
                </div>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <h4 className="font-medium">Condição do Veículo</h4>
              </div>
              <div className="divide-y">
                <div className="p-4">
                  <span className="text-gray-500 block mb-2">Características do veículo:</span>
                  <ul className="list-disc pl-5 space-y-1">
                    {datosFormulario.vehicleConditions.includes("none") ? (
                      <li>Nenhuma das opções</li>
                    ) : (
                      datosFormulario.vehicleConditions.map((condition: string) => (
                        <li key={condition}>{mapConditionToText(condition)}</li>
                      ))
                    )}
                  </ul>
                </div>
                <div className="p-4">
                  <span className="text-gray-500 block mb-2">Itens de segurança:</span>
                  <ul className="list-disc pl-5 space-y-1">
                    {datosFormulario.safetyItems.map((item: string) => (
                      <li key={item}>{mapSafetyItemToText(item)}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-gray-500">Ar-condicionado funcionando:</span>
                  <span className="font-medium">{datosFormulario.hasAirConditioner === "sim" ? "Sim" : "Não"}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-gray-500">Para-brisa com dano:</span>
                  <span className="font-medium">{datosFormulario.hasWindshieldDamage === "sim" ? "Sim" : "Não"}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-gray-500">Faróis/lanternas com dano:</span>
                  <span className="font-medium">{datosFormulario.hasLightsDamage === "sim" ? "Sim" : "Não"}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-gray-500">Pneus com dano:</span>
                  <span className="font-medium">{datosFormulario.hasTiresDamage === "sim" ? "Sim" : "Não"}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-gray-500">Sistema de som original:</span>
                  <span className="font-medium">
                    {datosFormulario.hasOriginalSoundSystem === "sim" ? "Sim" : "Não"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <h4 className="font-medium">Fotos e Vídeo</h4>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {datosFormulario.crlvPhotoUrl && (
                  <div>
                    <span className="text-gray-500 block mb-1">CRLV:</span>
                    <img
                      src={datosFormulario.crlvPhotoUrl || "/placeholder.svg"}
                      alt="CRLV"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
                {datosFormulario.safetyItemsPhotoUrl && (
                  <div>
                    <span className="text-gray-500 block mb-1">Itens de segurança:</span>
                    <img
                      src={datosFormulario.safetyItemsPhotoUrl || "/placeholder.svg"}
                      alt="Itens de segurança"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
                {datosFormulario.windshieldPhotoUrl && (
                  <div>
                    <span className="text-gray-500 block mb-1">Para-brisa:</span>
                    <img
                      src={datosFormulario.windshieldPhotoUrl || "/placeholder.svg"}
                      alt="Para-brisa"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
                {datosFormulario.lightsPhotoUrl && (
                  <div>
                    <span className="text-gray-500 block mb-1">Faróis/lanternas:</span>
                    <img
                      src={datosFormulario.lightsPhotoUrl || "/placeholder.svg"}
                      alt="Faróis/lanternas"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
                {datosFormulario.tiresPhotoUrl && (
                  <div>
                    <span className="text-gray-500 block mb-1">Pneus:</span>
                    <img
                      src={datosFormulario.tiresPhotoUrl || "/placeholder.svg"}
                      alt="Pneus"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
                {datosFormulario.videoFileUrl && (
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 block mb-1">Vídeo:</span>
                    <video
                      src={datosFormulario.videoFileUrl}
                      controls
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {(enviando || progress > 0) && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="flex items-center">
                  {comprimiendo ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Comprimindo arquivos...
                    </>
                  ) : (
                    <>
                      {progress < 100 ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      )}
                      Enviando inspeção...
                    </>
                  )}
                </p>
                <p className="font-medium">{progress}%</p>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {success && (
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Recebemos seus dados! Em breve enviaremos a pré-oferta.
              </AlertDescription>
            </Alert>
          )}

          {intentos > 0 && !success && (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
              <div className="flex items-center">
                <Info className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm">Problemas ao enviar? Tente o método alternativo.</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSubmit}
                className="text-xs"
              >
                {enviando ? "Enviando..." : "Enviar Inspeção"}
              </Button>
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Antes de enviar</h4>
                <p className="text-sm text-yellow-700">
                  Por favor, revise todas as informações cuidadosamente. Uma vez enviada, não poderá fazer alterações.
                  Nossa equipe revisará sua inspeção e entrará em contato para os próximos passos.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrevious} disabled={enviando || success}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={enviando || success}
              className="bg-blue-700 hover:bg-blue-800 px-8"
            >
              {enviando ? "Enviando..." : "Enviar Inspeção"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
