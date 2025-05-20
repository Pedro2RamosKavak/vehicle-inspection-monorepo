"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, RefreshCw } from "lucide-react"

interface PasoAgradecimientoProps {
  onReiniciar: () => void
}

export default function PasoAgradecimiento({ onReiniciar }: PasoAgradecimientoProps) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="bg-blue-700 text-white p-6">
        <CardTitle className="text-2xl font-bold">Inspeção Concluída!</CardTitle>
      </CardHeader>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <CheckCircle className="h-24 w-24 text-blue-500" />

          <h2 className="text-2xl font-bold">Recebemos seus dados!</h2>

          <p className="text-lg max-w-md mx-auto">Em breve enviaremos a pré-oferta para o seu veículo.</p>

          <p className="text-gray-600 max-w-md mx-auto">
            Nossa equipe está analisando as informações fornecidas e entrará em contato através do email ou telefone
            informados.
          </p>
          <p className="text-gray-600 max-w-md mx-auto">
            Em caso de necessidade, não hesite em nos contatar:
            <br />
            <span className="font-medium text-blue-600">Whatsapp: 11 3230-3881</span>
            <br />
            <span className="font-medium text-blue-600">Ligação: (11) 4858902</span>
          </p>

          <div className="pt-6">
            <Button onClick={onReiniciar} variant="outline" className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              Iniciar Nova Inspeção
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
