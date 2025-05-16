"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

interface FullScreenImageProps {
  url: string
  onClose: () => void
}

export default function FullScreenImage({ url, onClose }: FullScreenImageProps) {
  // Prevenir el scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  // Cerrar el modal al presionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    
    window.addEventListener("keydown", handleEscape)
    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Botón cerrar */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-200 transition-colors z-10"
      >
        <X className="h-6 w-6" />
      </button>
      
      {/* Imagen */}
      <div className="w-full h-full flex items-center justify-center p-4 md:p-10 overflow-auto">
        <img 
          src={url} 
          alt="Vista ampliada" 
          className="max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/placeholder.svg";
            target.alt = "Error al cargar la imagen";
          }}
        />
      </div>
      
      {/* Overlay para cerrar al hacer clic fuera de la imagen */}
      <div className="absolute inset-0" onClick={onClose}></div>
    </div>
  )
} 