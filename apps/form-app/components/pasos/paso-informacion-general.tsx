"use client"

import { type FormikProps, Form } from "formik"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, ArrowRight, ArrowLeft, User, Mail, Phone, Car, Calendar, FileText, Info } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

interface PasoInformacionGeneralProps {
  formik: FormikProps<any>
  onPrevious: () => void
  actualizarDatos: (datos: any) => void
}

export default function PasoInformacionGeneral({ formik, onPrevious, actualizarDatos }: PasoInformacionGeneralProps) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="bg-black text-white p-6">
        <CardTitle className="text-2xl font-bold flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Informações Gerais
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form className="space-y-6">
          <motion.div className="form-section" initial="hidden" animate="visible" custom={0} variants={fadeIn}>
            <h3 className="form-section-title">
              <User className="mr-2 h-5 w-5 text-blue-700" />
              Dados Pessoais
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName" className="input-label required-field">
                  Nome do titular
                </Label>
                <Input
                  id="ownerName"
                  name="ownerName"
                  value={formik.values.ownerName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Digite o nome completo do titular"
                  className={`${
                    formik.touched.ownerName && formik.errors.ownerName
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-700"
                  }`}
                />
                {formik.touched.ownerName && formik.errors.ownerName && (
                  <div className="error-text">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formik.errors.ownerName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="input-label required-field">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Digite seu email"
                    className={`pl-10 ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-blue-700"
                    }`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <div className="error-text">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="input-label required-field">
                  Celular
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="(00) 00000-0000"
                    className={`pl-10 ${
                      formik.touched.phone && formik.errors.phone
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-blue-700"
                    }`}
                  />
                </div>
                {formik.touched.phone && formik.errors.phone && (
                  <div className="error-text">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formik.errors.phone}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div className="form-section" initial="hidden" animate="visible" custom={1} variants={fadeIn}>
            <h3 className="form-section-title">
              <Car className="mr-2 h-5 w-5 text-blue-700" />
              Dados do Veículo
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="licensePlate" className="input-label required-field">
                  Placa
                </Label>
                <Input
                  id="licensePlate"
                  name="licensePlate"
                  value={formik.values.licensePlate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="ABC1234"
                  className={`uppercase ${
                    formik.touched.licensePlate && formik.errors.licensePlate
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-700"
                  }`}
                />
                {formik.touched.licensePlate && formik.errors.licensePlate && (
                  <div className="error-text">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formik.errors.licensePlate}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentKm" className="input-label required-field">
                    Quilometragem atual
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentKm"
                      name="currentKm"
                      type="number"
                      value={formik.values.currentKm}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Digite a quilometragem atual"
                      min="0"
                      className={`${
                        formik.touched.currentKm && formik.errors.currentKm
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-700"
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      km
                    </span>
                  </div>
                  {formik.touched.currentKm && formik.errors.currentKm && (
                    <div className="error-text">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formik.errors.currentKm}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelYear" className="input-label required-field">
                    Ano do modelo
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="modelYear"
                      name="modelYear"
                      type="number"
                      value={formik.values.modelYear}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Digite o ano do modelo"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className={`pl-10 ${
                        formik.touched.modelYear && formik.errors.modelYear
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-700"
                      }`}
                    />
                  </div>
                  {formik.touched.modelYear && formik.errors.modelYear && (
                    <div className="error-text">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formik.errors.modelYear}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="input-label required-field">
                    O veículo possui gravação do número do chassi nos vidros?
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1.5 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Verifique se os vidros do veículo possuem o número do chassi gravado. Geralmente está
                          localizado no canto inferior dos vidros.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  name="hasChassisNumber"
                  value={formik.values.hasChassisNumber}
                  onValueChange={(value) => formik.setFieldValue("hasChassisNumber", value)}
                  className="flex space-x-4"
                >
                  <div className="radio-item">
                    <RadioGroupItem value="sim" id="chassis-sim" />
                    <Label htmlFor="chassis-sim" className="cursor-pointer">
                      Sim
                    </Label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="nao" id="chassis-nao" />
                    <Label htmlFor="chassis-nao" className="cursor-pointer">
                      Não
                    </Label>
                  </div>
                </RadioGroup>
                {formik.touched.hasChassisNumber && formik.errors.hasChassisNumber && (
                  <div className="error-text">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formik.errors.hasChassisNumber}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="input-label required-field">O veículo possui segunda chave?</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1.5 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Verifique se você possui a chave reserva do veículo.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  name="hasSecondKey"
                  value={formik.values.hasSecondKey}
                  onValueChange={(value) => formik.setFieldValue("hasSecondKey", value)}
                  className="flex space-x-4"
                >
                  <div className="radio-item">
                    <RadioGroupItem value="sim" id="key-sim" />
                    <Label htmlFor="key-sim" className="cursor-pointer">
                      Sim
                    </Label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="nao" id="key-nao" />
                    <Label htmlFor="key-nao" className="cursor-pointer">
                      Não
                    </Label>
                  </div>
                </RadioGroup>
                {formik.touched.hasSecondKey && formik.errors.hasSecondKey && (
                  <div className="error-text">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formik.errors.hasSecondKey}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div className="form-section" initial="hidden" animate="visible" custom={2} variants={fadeIn}>
            <h3 className="form-section-title">
              <FileText className="mr-2 h-5 w-5 text-blue-700" />
              Documento do Veículo
            </h3>
            <div className="space-y-2">
              <FileUpload
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
                }}
                maxSize={10 * 1024 * 1024} // 10MB
                onFileChange={(file) => {
                  if (file) {
                    const objectUrl = URL.createObjectURL(file)
                    formik.setFieldValue("crlvPhoto", file)
                    formik.setFieldValue("crlvPhotoUrl", objectUrl)
                    // Validar el formulario después de cambiar el valor
                    formik.validateForm().then(() => {
                      formik.setTouched({
                        ...formik.touched,
                        crlvPhoto: true,
                      })
                    })
                  } else {
                    formik.setFieldValue("crlvPhoto", null)
                    formik.setFieldValue("crlvPhotoUrl", "")
                  }
                }}
                value={formik.values.crlvPhoto}
                previewUrl={formik.values.crlvPhotoUrl}
                error={
                  formik.touched.crlvPhoto && formik.errors.crlvPhoto ? String(formik.errors.crlvPhoto) : undefined
                }
                fileType="image"
                label="Foto do CRLV (Documento do veículo)"
                description="Tire uma foto do documento CRLV do veículo. Certifique-se que todas as informações estão legíveis."
                required={true}
              />
            </div>
          </motion.div>

          <motion.div
            className="pt-6 flex justify-between"
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeIn}
          >
            <Button type="button" variant="outline" onClick={onPrevious} className="btn-outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button type="submit" className="btn-primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? (
                "Processando..."
              ) : (
                <>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        </Form>
      </CardContent>
    </Card>
  )
}
