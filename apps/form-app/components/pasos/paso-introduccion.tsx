"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, Camera, Video, Clock, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface PasoIntroduccionProps {
  onNext: () => void
}

export default function PasoIntroduccion({ onNext }: PasoIntroduccionProps) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="bg-black text-white p-6">
        <CardTitle className="text-2xl font-bold">Inspeção Virtual</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose max-w-none">
          <motion.h2
            className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Olá, vamos começar a sua inspeção virtual
          </motion.h2>

          <motion.p className="mb-4 text-lg" initial="hidden" animate="visible" custom={0} variants={fadeIn}>
            Bem-vindo à inspeção virtual do seu veículo. Este processo é{" "}
            <span className="highlight">simples e rápido</span>, projetado para capturar todas as informações
            necessárias sobre o seu veículo.
          </motion.p>

          <motion.div
            className="mb-6 bg-[#f8f9fa] dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-700"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeIn}
          >
            <h3 className="font-medium text-lg mb-2">Você precisará:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FileText className="h-5 w-5 mr-2 text-blue-700 dark:text-blue-400 mt-0.5" />
                <span>
                  Documento do veículo (<span className="keyword">CRLV</span>)
                </span>
              </li>
              <li className="flex items-start">
                <Camera className="h-5 w-5 mr-2 text-blue-700 dark:text-blue-400 mt-0.5" />
                <span>Acesso ao veículo para tirar fotos</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-2 text-blue-700 dark:text-blue-400 mt-0.5" />
                <span>
                  Aproximadamente <span className="keyword">10 minutos</span> do seu tempo
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={2} variants={fadeIn}>
            <h3 className="font-medium text-lg mb-2">Durante o processo, você será solicitado a:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium">Informações Básicas</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fornecer informações básicas sobre você e seu veículo
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium">Condição do Veículo</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Responder perguntas sobre a condição do veículo
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                    <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium">Fotos</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tirar fotos de partes específicas do veículo</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                    <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium">Vídeo</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gravar um vídeo curto mostrando o exterior e interior do veículo
                </p>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="mb-6 text-lg font-medium text-center"
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeIn}
          >
            O processo leva em torno de <span className="highlight">10 minutos</span>. Agora sim, vamos começar!
          </motion.p>
        </div>

        <motion.div className="mt-6 flex justify-end" initial="hidden" animate="visible" custom={4} variants={fadeIn}>
          <Button
            onClick={onNext}
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 px-5 rounded-md transition-all duration-200 hover:shadow-lg flex items-center"
          >
            Começar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}
