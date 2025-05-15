"use client"
import { type FormikProps, Form } from "formik"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"

interface PasoCondicionVehiculoProps {
  formik: FormikProps<any>
  onPrevious: () => void
  actualizarDatos: (datos: any) => void
}

export default function PasoCondicionVehiculo({ formik, onPrevious, actualizarDatos }: PasoCondicionVehiculoProps) {
  const handleVehicleConditionChange = (value: string) => {
    let currentConditions = [...formik.values.vehicleConditions]

    if (value === "none") {
      // Si selecciona "Ninguna de las opciones", desmarcar todas las demás
      formik.setFieldValue("vehicleConditions", ["none"])
      return
    }

    // Si ya está seleccionado, quitarlo
    if (currentConditions.includes(value)) {
      currentConditions = currentConditions.filter((item) => item !== value)
    } else {
      // Si no está seleccionado, agregarlo y quitar "none" si está seleccionado
      currentConditions = currentConditions.filter((item) => item !== "none")
      currentConditions.push(value)
    }

    formik.setFieldValue("vehicleConditions", currentConditions)
  }

  const handleSafetyItemChange = (value: string) => {
    let currentItems = [...formik.values.safetyItems]

    // Si ya está seleccionado, quitarlo
    if (currentItems.includes(value)) {
      currentItems = currentItems.filter((item) => item !== value)
    } else {
      // Si no está seleccionado, agregarlo
      currentItems.push(value)
    }

    formik.setFieldValue("safetyItems", currentItems)
  }

  const vehicleConditionOptions = [
    { id: "theft", label: "Possui histórico de roubo e furto" },
    { id: "armored", label: "É blindado" },
    { id: "gas", label: "Tem Kit gás (GNV)" },
    { id: "structural", label: "Dano estrutural" },
    { id: "auction", label: "Já teve passagem por leilão" },
    { id: "crash", label: "Já teve batida" },
    { id: "modified", label: "Possui modificação na estrutura" },
    { id: "lowered", label: "Rebaixado" },
    { id: "performance", label: "Possui alguma alteração de performance (escape, remap, admissão, etc…)" },
    { id: "none", label: "Nenhuma das opções acima" },
  ]

  const safetyItemOptions = [
    { id: "wrench", label: "Chave de roda" },
    { id: "spare", label: "Estepe" },
    { id: "triangle", label: "Triângulo" },
  ]

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="bg-black text-white p-6">
        <CardTitle className="text-2xl font-bold">🔍 Condições do Veículo</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form className="space-y-8">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">O seu veículo possui alguma das características abaixo?*</Label>
              <div className="mt-3 space-y-3">
                {vehicleConditionOptions.map((option) => (
                  <div key={option.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${option.id}`}
                      checked={formik.values.vehicleConditions.includes(option.id)}
                      onCheckedChange={() => handleVehicleConditionChange(option.id)}
                      disabled={
                        (option.id !== "none" && formik.values.vehicleConditions.includes("none")) ||
                        (option.id === "none" &&
                          formik.values.vehicleConditions.length > 0 &&
                          !formik.values.vehicleConditions.includes("none"))
                      }
                    />
                    <Label
                      htmlFor={`condition-${option.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formik.touched.vehicleConditions && formik.errors.vehicleConditions && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formik.errors.vehicleConditions}
                </div>
              )}
            </div>

            <div>
              <Label className="text-base font-medium">Quais itens de segurança o veículo possui?*</Label>
              <div className="mt-3 space-y-3">
                {safetyItemOptions.map((option) => (
                  <div key={option.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`safety-${option.id}`}
                      checked={formik.values.safetyItems.includes(option.id)}
                      onCheckedChange={() => handleSafetyItemChange(option.id)}
                    />
                    <Label
                      htmlFor={`safety-${option.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formik.touched.safetyItems && formik.errors.safetyItems && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formik.errors.safetyItems}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Foto dos itens de segurança*</Label>
              <FileUpload
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
                }}
                maxSize={10 * 1024 * 1024} // 10MB
                onFileChange={(file) => {
                  if (file) {
                    const objectUrl = URL.createObjectURL(file)
                    formik.setFieldValue("safetyItemsPhoto", file)
                    formik.setFieldValue("safetyItemsPhotoUrl", objectUrl)
                    // Validar el formulario después de cambiar el valor
                    formik.validateForm().then(() => {
                      formik.setTouched({
                        ...formik.touched,
                        safetyItemsPhoto: true,
                      })
                    })
                  } else {
                    formik.setFieldValue("safetyItemsPhoto", null)
                    formik.setFieldValue("safetyItemsPhotoUrl", "")
                  }
                }}
                value={formik.values.safetyItemsPhoto}
                previewUrl={formik.values.safetyItemsPhotoUrl}
                error={
                  formik.touched.safetyItemsPhoto && formik.errors.safetyItemsPhoto
                    ? String(formik.errors.safetyItemsPhoto)
                    : undefined
                }
                fileType="image"
                label="Clique para fazer upload da foto dos itens de segurança"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">O ar-condicionado está gelando?</Label>
              <RadioGroup
                name="hasAirConditioner"
                value={formik.values.hasAirConditioner}
                onValueChange={(value) => formik.setFieldValue("hasAirConditioner", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="ac-sim" />
                  <Label htmlFor="ac-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="ac-nao" />
                  <Label htmlFor="ac-nao">Não</Label>
                </div>
              </RadioGroup>
              {formik.touched.hasAirConditioner && formik.errors.hasAirConditioner && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formik.errors.hasAirConditioner}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">O para-brisa apresenta avaria?</Label>
              <RadioGroup
                name="hasWindshieldDamage"
                value={formik.values.hasWindshieldDamage}
                onValueChange={(value) => formik.setFieldValue("hasWindshieldDamage", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="windshield-sim" />
                  <Label htmlFor="windshield-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="windshield-nao" />
                  <Label htmlFor="windshield-nao">Não</Label>
                </div>
              </RadioGroup>
              {formik.touched.hasWindshieldDamage && formik.errors.hasWindshieldDamage && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formik.errors.hasWindshieldDamage}
                </div>
              )}
            </div>

            {formik.values.hasWindshieldDamage === "sim" && (
              <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <Label className="text-base font-medium">Foto para-brisa*</Label>
                <FileUpload
                  accept={{
                    "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
                  }}
                  maxSize={10 * 1024 * 1024} // 10MB
                  onFileChange={(file) => {
                    if (file) {
                      const objectUrl = URL.createObjectURL(file)
                      formik.setFieldValue("windshieldPhoto", file)
                      formik.setFieldValue("windshieldPhotoUrl", objectUrl)
                      // Validar el formulario después de cambiar el valor
                      formik.validateForm().then(() => {
                        formik.setTouched({
                          ...formik.touched,
                          windshieldPhoto: true,
                        })
                      })
                    } else {
                      formik.setFieldValue("windshieldPhoto", null)
                      formik.setFieldValue("windshieldPhotoUrl", "")
                    }
                  }}
                  value={formik.values.windshieldPhoto}
                  previewUrl={formik.values.windshieldPhotoUrl}
                  error={
                    formik.touched.windshieldPhoto && formik.errors.windshieldPhoto
                      ? String(formik.errors.windshieldPhoto)
                      : undefined
                  }
                  fileType="image"
                  label="Clique para fazer upload da foto do para-brisa"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-base font-medium">Faróis/lanternas/retrovisores apresentam dano?*</Label>
              <RadioGroup
                name="hasLightsDamage"
                value={formik.values.hasLightsDamage}
                onValueChange={(value) => formik.setFieldValue("hasLightsDamage", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="lights-sim" />
                  <Label htmlFor="lights-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="lights-nao" />
                  <Label htmlFor="lights-nao">Não</Label>
                </div>
              </RadioGroup>
              {formik.touched.hasLightsDamage && formik.errors.hasLightsDamage && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formik.errors.hasLightsDamage}
                </div>
              )}
            </div>

            {formik.values.hasLightsDamage === "sim" && (
              <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <Label className="text-base font-medium">Foto dos faróis/lanternas*</Label>
                <FileUpload
                  accept={{
                    "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
                  }}
                  maxSize={10 * 1024 * 1024} // 10MB
                  onFileChange={(file) => {
                    if (file) {
                      const objectUrl = URL.createObjectURL(file)
                      formik.setFieldValue("lightsPhoto", file)
                      formik.setFieldValue("lightsPhotoUrl", objectUrl)
                      // Validar el formulario después de cambiar el valor
                      formik.validateForm().then(() => {
                        formik.setTouched({
                          ...formik.touched,
                          lightsPhoto: true,
                        })
                      })
                    } else {
                      formik.setFieldValue("lightsPhoto", null)
                      formik.setFieldValue("lightsPhotoUrl", "")
                    }
                  }}
                  value={formik.values.lightsPhoto}
                  previewUrl={formik.values.lightsPhotoUrl}
                  error={
                    formik.touched.lightsPhoto && formik.errors.lightsPhoto
                      ? String(formik.errors.lightsPhoto)
                      : undefined
                  }
                  fileType="image"
                  label="Clique para fazer upload da foto dos faróis/lanternas"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-base font-medium">Pneus apresentam dano/deformação?*</Label>
              <RadioGroup
                name="hasTiresDamage"
                value={formik.values.hasTiresDamage}
                onValueChange={(value) => formik.setFieldValue("hasTiresDamage", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="tires-sim" />
                  <Label htmlFor="tires-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="tires-nao" />
                  <Label htmlFor="tires-nao">Não</Label>
                </div>
              </RadioGroup>
              {formik.touched.hasTiresDamage && formik.errors.hasTiresDamage && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formik.errors.hasTiresDamage}
                </div>
              )}
            </div>

            {formik.values.hasTiresDamage === "sim" && (
              <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <Label className="text-base font-medium">Foto dos pneus*</Label>
                <FileUpload
                  accept={{
                    "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
                  }}
                  maxSize={10 * 1024 * 1024} // 10MB
                  onFileChange={(file) => {
                    if (file) {
                      const objectUrl = URL.createObjectURL(file)
                      formik.setFieldValue("tiresPhoto", file)
                      formik.setFieldValue("tiresPhotoUrl", objectUrl)
                      // Validar el formulario después de cambiar el valor
                      formik.validateForm().then(() => {
                        formik.setTouched({
                          ...formik.touched,
                          tiresPhoto: true,
                        })
                      })
                    } else {
                      formik.setFieldValue("tiresPhoto", null)
                      formik.setFieldValue("tiresPhotoUrl", "")
                    }
                  }}
                  value={formik.values.tiresPhoto}
                  previewUrl={formik.values.tiresPhotoUrl}
                  error={
                    formik.touched.tiresPhoto && formik.errors.tiresPhoto ? String(formik.errors.tiresPhoto) : undefined
                  }
                  fileType="image"
                  label="Clique para fazer upload da foto dos pneus"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-base font-medium">Sistema de som/infotenimento é original?</Label>
              <RadioGroup
                name="hasOriginalSoundSystem"
                value={formik.values.hasOriginalSoundSystem}
                onValueChange={(value) => formik.setFieldValue("hasOriginalSoundSystem", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="sound-sim" />
                  <Label htmlFor="sound-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="sound-nao" />
                  <Label htmlFor="sound-nao">Não</Label>
                </div>
              </RadioGroup>
              {formik.touched.hasOriginalSoundSystem && formik.errors.hasOriginalSoundSystem && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formik.errors.hasOriginalSoundSystem}
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
