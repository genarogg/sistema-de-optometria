import type React from "react"

/**
 * Carga una imagen desde un input file y retorna el base64
 * para luego pasarlo al cropper
 */
export function loadImageAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("El archivo debe ser una imagen"))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const base64 = reader.result as string
      resolve(base64)
    }

    reader.onerror = () => {
      reject(new Error("Error al leer la imagen"))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Handler para procesar la selección de imagen desde un input file
 * Retorna el base64 para pasarlo al cropper
 */
export async function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>): Promise<string | null> {
  const file = event.target.files?.[0]
  if (!file) return null

  try {
    const base64 = await loadImageAsBase64(file)
    return base64
  } catch (error) {
    console.error("Error al cargar imagen:", error)
    return null
  }
}
