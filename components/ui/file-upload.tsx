"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, X, FileImage, FileVideo, Upload, CheckCircle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FileUploadProps {
  accept: Record<string, string[]>
  maxSize?: number
  onFileChange: (file: File | null) => void
  value: File | null
  previewUrl?: string
  error?: string
  fileType?: "image" | "video"
  label?: string
  description?: string
  required?: boolean
}

export function FileUpload({
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB por defecto
  onFileChange,
  value,
  previewUrl,
  error,
  fileType = "image",
  label = "Clique para fazer upload",
  description,
  required = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      validateAndProcessFile(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      validateAndProcessFile(file)
    }
  }

  const validateAndProcessFile = (file: File) => {
    // Verificar tipo de archivo
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
    const acceptedTypes = Object.values(accept).flat()
    const isValidType = Object.keys(accept).some((type) => {
      if (file.type.startsWith(type.replace("/*", "/"))) {
        return true
      }
      const extensions = accept[type]
      return extensions.some((ext) => ext.toLowerCase() === fileExtension)
    })

    if (!isValidType) {
      alert(`Tipo de arquivo não suportado. Por favor, use: ${acceptedTypes.join(", ")}`)
      return
    }

    // Verificar tamaño
    if (file.size > maxSize) {
      alert(`Arquivo muito grande. O tamanho máximo é ${Math.round(maxSize / (1024 * 1024))}MB`)
      return
    }

    // Simular progreso de carga
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 100)

    // Llamar al callback con el archivo
    onFileChange(file)
  }

  const handleRemoveFile = () => {
    onFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} bytes`
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`
    }
  }

  const renderPreview = () => {
    if (!previewUrl) return null

    if (fileType === "image") {
      return (
        <div className="relative mt-2 rounded-md overflow-hidden group">
          <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover rounded-md" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemoveFile}
              className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Remover arquivo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 flex justify-between items-center">
            <span className="truncate">{value?.name}</span>
            <span>{value && formatFileSize(value.size)}</span>
          </div>
        </div>
      )
    } else if (fileType === "video") {
      return (
        <div className="relative mt-2 rounded-md overflow-hidden group">
          <video src={previewUrl} controls className="w-full h-48 object-cover rounded-md" />
          <div className="absolute top-0 right-0 m-2">
            <button
              type="button"
              onClick={handleRemoveFile}
              className="bg-red-500 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity duration-300"
              aria-label="Remover arquivo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 flex justify-between items-center">
            <span className="truncate">{value?.name}</span>
            <span>{value && formatFileSize(value.size)}</span>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center">
          <label className={`input-label ${required ? "required-field" : ""}`}>
            {label}
            {description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1.5 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </label>
        </div>
      )}

      {!value && (
        <div
          className={`file-upload-container ${
            isDragging ? "file-upload-active" : "file-upload-hover"
          } transition-all duration-300 hover:shadow-md`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept={Object.entries(accept)
              .map(([type, exts]) => (type === "*/*" ? exts.join(",") : type))
              .join(",")}
            className="hidden"
          />

          <div className="flex flex-col items-center">
            {fileType === "image" ? (
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3">
                <FileImage className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            ) : (
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3">
                <FileVideo className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            )}

            <div className="mt-2">
              <p className="text-base font-medium text-gray-900 dark:text-gray-100">{label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Arraste e solte ou{" "}
                <span className="text-blue-700 dark:text-blue-400 font-bold">clique para selecionar</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {fileType === "image"
                  ? "Formatos aceitos: JPG, PNG, GIF (máx. " + formatFileSize(maxSize) + ")"
                  : "Formatos aceitos: MP4, MOV, AVI (máx. " + formatFileSize(maxSize) + ")"}
              </p>
            </div>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="flex items-center">
              <Upload className="h-4 w-4 mr-1.5 text-blue-500 animate-pulse" />
              <span>Carregando arquivo...</span>
            </span>
            <span className="font-medium">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {renderPreview()}

      {error && (
        <div className="error-text">
          <AlertCircle className="h-4 w-4 mr-1.5" />
          {error}
        </div>
      )}

      {value && !error && !isUploading && (
        <div className="success-text">
          <CheckCircle className="h-4 w-4 mr-1.5" />
          Arquivo carregado com sucesso
        </div>
      )}
    </div>
  )
}
