"use client"

import { useState, useEffect } from "react"
import { Formik } from "formik"
import * as Yup from "yup"
import PasoIntroduccion from "./pasos/paso-introduccion"
import PasoInformacionGeneral from "./pasos/paso-informacion-general"
import PasoCondicionVehiculo from "./pasos/paso-condicion-vehiculo"
import PasoVideo from "./pasos/paso-video"
import PasoConfirmacion from "./pasos/paso-confirmacion"
import PasoAgradecimiento from "./pasos/paso-agradecimiento"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

// Definir los pasos del formulario
const PASOS = ["introduccion", "informacion-general", "condicion-vehiculo", "video", "confirmacion", "agradecimiento"]

// Esquema de validación para cada paso
const esquemaValidacion = {
  "informacion-general": Yup.object({
    ownerName: Yup.string().required("Nome do titular é obrigatório"),
    email: Yup.string().email("Email inválido").required("Email é obrigatório"),
    phone: Yup.string().required("Celular é obrigatório"),
    licensePlate: Yup.string().required("Placa é obrigatória"),
    currentKm: Yup.number().required("Quilometragem atual é obrigatória").min(0, "Quilometragem deve ser maior que 0"),
    modelYear: Yup.number()
      .required("Ano do modelo é obrigatório")
      .min(1900, "Ano deve ser maior que 1900")
      .max(new Date().getFullYear(), `Ano deve ser menor que ${new Date().getFullYear() + 1}`),
    hasChassisNumber: Yup.string().required("Este campo é obrigatório"),
    hasSecondKey: Yup.string().required("Este campo é obrigatório"),
    crlvPhoto: Yup.mixed().required("Foto do CRLV é obrigatória"),
  }),
  "condicion-vehiculo": Yup.object({
    vehicleConditions: Yup.array().min(1, "Selecione pelo menos uma opção"),
    safetyItems: Yup.array().min(1, "Selecione pelo menos um item de segurança"),
    safetyItemsPhoto: Yup.mixed().required("Foto dos itens de segurança é obrigatória"),
    hasAirConditioner: Yup.string().required("Este campo é obrigatório"),
    hasWindshieldDamage: Yup.string().required("Este campo é obrigatório"),
    windshieldPhoto: Yup.mixed().when("hasWindshieldDamage", {
      is: "sim",
      then: () => Yup.mixed().required("Foto do para-brisa é obrigatória"),
      otherwise: () => Yup.mixed().notRequired(),
    }),
    hasLightsDamage: Yup.string().required("Este campo é obrigatório"),
    lightsPhoto: Yup.mixed().when("hasLightsDamage", {
      is: "sim",
      then: () => Yup.mixed().required("Foto dos faróis/lanternas é obrigatória"),
      otherwise: () => Yup.mixed().notRequired(),
    }),
    hasTiresDamage: Yup.string().required("Este campo é obrigatório"),
    tiresPhoto: Yup.mixed().when("hasTiresDamage", {
      is: "sim",
      then: () => Yup.mixed().required("Foto dos pneus é obrigatória"),
      otherwise: () => Yup.mixed().notRequired(),
    }),
    hasOriginalSoundSystem: Yup.string().required("Este campo é obrigatório"),
  }),
  video: Yup.object({
    videoFile: Yup.mixed().required("O vídeo é obrigatório"),
  }),
}

export default function InspeccionVehiculo() {
  // Estado para el paso actual
  const [pasoActual, setPasoActual] = useState(0)

  // Estado para el progreso
  const [progreso, setProgreso] = useState(0)

  // Estado para errores
  const [error, setError] = useState("")

  // Estado para indicar si se está enviando el formulario
  const [enviando, setEnviando] = useState(false)

  // Estado para la dirección de la transición
  const [direction, setDirection] = useState(0)

  // Estado para verificar si la URL de Zapier está configurada
  const [zapierConfigured, setZapierConfigured] = useState(true)

  // Estado para los datos del formulario
  const [datosFormulario, setDatosFormulario] = useState({
    // Información general
    ownerName: "",
    email: "",
    phone: "",
    licensePlate: "",
    currentKm: "",
    modelYear: "",
    hasChassisNumber: "",
    hasSecondKey: "",
    crlvPhoto: null,
    crlvPhotoUrl: "",

    // Condición del vehículo
    vehicleConditions: [] as string[],
    safetyItems: [] as string[],
    safetyItemsPhoto: null,
    safetyItemsPhotoUrl: "",
    hasAirConditioner: "",
    hasWindshieldDamage: "",
    windshieldPhoto: null,
    windshieldPhotoUrl: "",
    hasLightsDamage: "",
    lightsPhoto: null,
    lightsPhotoUrl: "",
    hasTiresDamage: "",
    tiresPhoto: null,
    tiresPhotoUrl: "",
    hasOriginalSoundSystem: "",

    // Video
    videoFile: null,
    videoFileUrl: "",
    videoBlob: undefined as Blob | undefined,
  })

  // Tema
  const { theme } = useTheme()

  // Verificar si la URL de Zapier está configurada
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL) {
      console.warn("La URL del webhook de Zapier no está configurada")
      setZapierConfigured(false)
    } else {
      console.log("URL del webhook de Zapier configurada:", process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL)
      setZapierConfigured(true)
    }
  }, [])

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem("inspeccionVehicular")
    if (datosGuardados) {
      try {
        const datos = JSON.parse(datosGuardados)
        // No restauramos archivos ya que no se pueden serializar
        const {
          crlvPhoto,
          crlvPhotoUrl,
          safetyItemsPhoto,
          safetyItemsPhotoUrl,
          windshieldPhoto,
          windshieldPhotoUrl,
          lightsPhoto,
          lightsPhotoUrl,
          tiresPhoto,
          tiresPhotoUrl,
          videoFile,
          videoFileUrl,
          videoBlob,
          ...restoDeLosDatos
        } = datos

        setDatosFormulario((prevState) => ({
          ...prevState,
          ...restoDeLosDatos,
          crlvPhotoUrl,
          safetyItemsPhotoUrl,
          windshieldPhotoUrl,
          lightsPhotoUrl,
          tiresPhotoUrl,
          videoFileUrl,
        }))

        // Restaurar el paso actual
        const pasoGuardado = localStorage.getItem("pasoActualInspeccion")
        if (pasoGuardado) {
          const paso = Number.parseInt(pasoGuardado)
          setPasoActual(paso)
          actualizarProgreso(paso)
        }
      } catch (error) {
        console.error("Error al cargar datos guardados:", error)
      }
    }
  }, [])

  // Guardar datos cuando cambian
  useEffect(() => {
    // No guardamos archivos ya que no se pueden serializar
    const {
      crlvPhoto,
      safetyItemsPhoto,
      windshieldPhoto,
      lightsPhoto,
      tiresPhoto,
      videoFile,
      videoBlob,
      ...datosParaGuardar
    } = datosFormulario

    localStorage.setItem("inspeccionVehicular", JSON.stringify(datosParaGuardar))
    localStorage.setItem("pasoActualInspeccion", pasoActual.toString())
  }, [datosFormulario, pasoActual])

  // Función para actualizar el progreso
  const actualizarProgreso = (paso: number) => {
    const porcentaje = (paso / (PASOS.length - 1)) * 100
    setProgreso(porcentaje)
  }

  // Función para actualizar los datos del formulario
  const actualizarDatos = (datos: any) => {
    setDatosFormulario((prevState) => ({
      ...prevState,
      ...datos,
    }))

    // Forzar una actualización de la interfaz de usuario
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"))
    }, 100)
  }

  // Función para avanzar al siguiente paso
  const siguientePaso = () => {
    if (pasoActual < PASOS.length - 1) {
      // Guardar explícitamente en localStorage antes de avanzar
      const {
        crlvPhoto,
        safetyItemsPhoto,
        windshieldPhoto,
        lightsPhoto,
        tiresPhoto,
        videoFile,
        videoBlob,
        ...datosParaGuardar
      } = datosFormulario

      localStorage.setItem("inspeccionVehicular", JSON.stringify(datosParaGuardar))
      localStorage.setItem("pasoActualInspeccion", (pasoActual + 1).toString())

      setDirection(1) // Avanzando
      const nuevoPaso = pasoActual + 1
      setPasoActual(nuevoPaso)
      actualizarProgreso(nuevoPaso)
      window.scrollTo(0, 0)
    }
  }

  // Función para retroceder al paso anterior
  const pasoAnterior = () => {
    if (pasoActual > 0) {
      setDirection(-1) // Retrocediendo
      const nuevoPaso = pasoActual - 1
      setPasoActual(nuevoPaso)
      actualizarProgreso(nuevoPaso)
      window.scrollTo(0, 0)
    }
  }

  // Función para manejar el envío del formulario
  const manejarEnvio = async () => {
    setEnviando(true)
    setError("")

    try {
      // La lógica de envío ahora está en el componente PasoConfirmacion
      siguientePaso()
    } catch (error: any) {
      console.error("Error al enviar el formulario:", error)
      setError(error.message || "Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.")
    } finally {
      setEnviando(false)
    }
  }

  // Limpiar URLs de objetos cuando el componente se desmonta
  useEffect(() => {
    return () => {
      // Limpiar todas las URLs de objetos
      if (datosFormulario.crlvPhotoUrl) URL.revokeObjectURL(datosFormulario.crlvPhotoUrl)
      if (datosFormulario.safetyItemsPhotoUrl) URL.revokeObjectURL(datosFormulario.safetyItemsPhotoUrl)
      if (datosFormulario.windshieldPhotoUrl) URL.revokeObjectURL(datosFormulario.windshieldPhotoUrl)
      if (datosFormulario.lightsPhotoUrl) URL.revokeObjectURL(datosFormulario.lightsPhotoUrl)
      if (datosFormulario.tiresPhotoUrl) URL.revokeObjectURL(datosFormulario.tiresPhotoUrl)
      if (datosFormulario.videoFileUrl) URL.revokeObjectURL(datosFormulario.videoFileUrl)
    }
  }, [datosFormulario])

  // Función para reiniciar el formulario
  const reiniciarFormulario = () => {
    // Limpiar todas las URLs de objetos
    if (datosFormulario.crlvPhotoUrl) URL.revokeObjectURL(datosFormulario.crlvPhotoUrl)
    if (datosFormulario.safetyItemsPhotoUrl) URL.revokeObjectURL(datosFormulario.safetyItemsPhotoUrl)
    if (datosFormulario.windshieldPhotoUrl) URL.revokeObjectURL(datosFormulario.windshieldPhotoUrl)
    if (datosFormulario.lightsPhotoUrl) URL.revokeObjectURL(datosFormulario.lightsPhotoUrl)
    if (datosFormulario.tiresPhotoUrl) URL.revokeObjectURL(datosFormulario.tiresPhotoUrl)
    if (datosFormulario.videoFileUrl) URL.revokeObjectURL(datosFormulario.videoFileUrl)

    localStorage.removeItem("inspeccionVehicular")
    localStorage.removeItem("pasoActualInspeccion")
    setDatosFormulario({
      // Información general
      ownerName: "",
      email: "",
      phone: "",
      licensePlate: "",
      currentKm: "",
      modelYear: "",
      hasChassisNumber: "",
      hasSecondKey: "",
      crlvPhoto: null,
      crlvPhotoUrl: "",

      // Condición del vehículo
      vehicleConditions: [],
      safetyItems: [],
      safetyItemsPhoto: null,
      safetyItemsPhotoUrl: "",
      hasAirConditioner: "",
      hasWindshieldDamage: "",
      windshieldPhoto: null,
      windshieldPhotoUrl: "",
      hasLightsDamage: "",
      lightsPhoto: null,
      lightsPhotoUrl: "",
      hasTiresDamage: "",
      tiresPhoto: null,
      tiresPhotoUrl: "",
      hasOriginalSoundSystem: "",

      // Video
      videoFile: null,
      videoFileUrl: "",
      videoBlob: undefined,
    })

    setPasoActual(0)
    setProgreso(0)
  }

  // Renderizar el paso actual
  const renderizarPaso = () => {
    switch (PASOS[pasoActual]) {
      case "introduccion":
        return <PasoIntroduccion onNext={siguientePaso} />
      case "informacion-general":
        return (
          <Formik
            initialValues={datosFormulario}
            validationSchema={esquemaValidacion["informacion-general"]}
            onSubmit={(values) => {
              actualizarDatos(values)
              siguientePaso()
            }}
            enableReinitialize
          >
            {(formikProps) => (
              <PasoInformacionGeneral
                formik={formikProps}
                onPrevious={pasoAnterior}
                actualizarDatos={actualizarDatos}
              />
            )}
          </Formik>
        )
      case "condicion-vehiculo":
        return (
          <Formik
            initialValues={datosFormulario}
            validationSchema={esquemaValidacion["condicion-vehiculo"]}
            onSubmit={(values) => {
              actualizarDatos(values)
              siguientePaso()
            }}
            enableReinitialize
          >
            {(formikProps) => (
              <PasoCondicionVehiculo formik={formikProps} onPrevious={pasoAnterior} actualizarDatos={actualizarDatos} />
            )}
          </Formik>
        )
      case "video":
        return (
          <Formik
            initialValues={datosFormulario}
            validationSchema={esquemaValidacion.video}
            onSubmit={(values) => {
              actualizarDatos(values)
              siguientePaso()
            }}
            enableReinitialize
          >
            {(formikProps) => (
              <PasoVideo formik={formikProps} onPrevious={pasoAnterior} actualizarDatos={actualizarDatos} />
            )}
          </Formik>
        )
      case "confirmacion":
        return (
          <PasoConfirmacion
            datosFormulario={datosFormulario}
            onSubmit={manejarEnvio}
            onPrevious={pasoAnterior}
            enviando={enviando}
            error={error}
          />
        )
      case "agradecimiento":
        return <PasoAgradecimiento onReiniciar={reiniciarFormulario} />
      default:
        return null
    }
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50"}`}>
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <div className="flex justify-center mb-8">
          <img src="/images/KAVAK_LOGO_MAIN_BLACK.png" alt="Kavak Logo" className="h-12 md:h-16" />
        </div>

        {!zapierConfigured && (
          <Alert variant="warning" className="mb-6 bg-yellow-50 border-yellow-200">
            <Info className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              A URL do webhook do Zapier não está configurada. Os dados do formulário não serão enviados.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span>Progresso</span>
            <span>{Math.round(progreso)}%</span>
          </div>
          <Progress value={progreso} className="h-2" />
        </div>

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={pasoActual}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            data-step={pasoActual + 1}
          >
            {renderizarPaso()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
