"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface ImageCropperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string
  onCropComplete: (croppedImage: string) => void
}

interface CropArea {
  x: number
  y: number
}

export function ImageCropper({ open, onOpenChange, imageSrc, onCropComplete }: ImageCropperProps) {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState<CropArea>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<CropArea>({ x: 0, y: 0 })
  const [cropSize, setCropSize] = useState(300)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleStart = (x: number, y: number) => {
    setIsDragging(true)
    setDragStart({ x: x - position.x, y: y - position.y })
  }

  const handleMove = (x: number, y: number) => {
    if (!isDragging) return
    setPosition({ x: x - dragStart.x, y: y - dragStart.y })
  }

  const handleEnd = () => setIsDragging(false)

  // Soporte táctil
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY)
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY)
  const onTouchEnd = () => handleEnd()

  // Soporte mouse
  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY)
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY)
  const handleMouseUp = () => handleEnd()

  const handleReset = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleImageLoad = () => {
    if (!imageRef.current || !containerRef.current) return
    const img = imageRef.current
    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const minDimension = Math.min(img.offsetWidth, img.offsetHeight)
    const maxContainerSize = Math.min(containerRect.width, containerRect.height) * 0.9
    setCropSize(Math.min(minDimension, maxContainerSize))
  }

  const handleCrop = () => {
    if (!imageRef.current || !containerRef.current) return
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const outputSize = 400
    canvas.width = outputSize
    canvas.height = outputSize

    const img = imageRef.current
    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()

    const imgNaturalWidth = img.naturalWidth
    const imgNaturalHeight = img.naturalHeight
    const imgDisplayWidth = img.offsetWidth * zoom
    const imgDisplayHeight = img.offsetHeight * zoom

    const centerX = containerRect.width / 2
    const centerY = containerRect.height / 2
    const imgX = centerX - imgDisplayWidth / 2 + position.x
    const imgY = centerY - imgDisplayHeight / 2 + position.y
    const cropX = centerX - cropSize / 2
    const cropY = centerY - cropSize / 2

    const scaleX = imgNaturalWidth / imgDisplayWidth
    const scaleY = imgNaturalHeight / imgDisplayHeight
    const sourceX = (cropX - imgX) * scaleX
    const sourceY = (cropY - imgY) * scaleY
    const sourceWidth = cropSize * scaleX
    const sourceHeight = cropSize * scaleY

    ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, outputSize, outputSize)

    const croppedBase64 = canvas.toDataURL("image/jpeg", 0.9)
    onCropComplete(croppedBase64)
    onOpenChange(false)
    handleReset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Recortar imagen</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Área de recorte */}
          <div
            ref={containerRef}
            className="relative w-full h-80 bg-muted rounded-lg overflow-hidden cursor-move select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            >
              <img
                ref={imageRef}
                src={imageSrc || ""}
                alt="Preview"
                className="pointer-events-none"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                }}
                draggable={false}
                onLoad={handleImageLoad}
              />
            </div>

            {/* Overlay oscuro con hueco */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full">
                <defs>
                  <mask id="cropMask">
                    <rect width="100%" height="100%" fill="white" />
                    <rect
                      x="50%"
                      y="50%"
                      width={cropSize}
                      height={cropSize}
                      transform={`translate(-${cropSize / 2}, -${cropSize / 2})`}
                      fill="black"
                      rx="4"
                    />
                  </mask>
                </defs>
                <rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#cropMask)" />
              </svg>
            </div>

            {/* Borde del área */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded pointer-events-none"
              style={{ width: `${cropSize}px`, height: `${cropSize}px` }}
            />
          </div>

          {/* Controles */}
          <div className="flex items-center gap-4">
            <ZoomOut className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[zoom]}
              min={0.5}
              max={3}
              step={0.1}
              onValueChange={(value: any) => setZoom(value[0])}
              className="flex-1"
            />
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
            <Button variant="ghost" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

     <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  color: "#111827",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCrop}
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
              >
                Aplicar recorte
              </Button>
            </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
