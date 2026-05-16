'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TipoSuscripcion } from '@/global/enums';
import { crearSuscripcionService } from '../service/crearSuscripcion.service';
import notify from '@/components/nano/notify';
import { Upload, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ModalSuscribirmeProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
}

export default function ModalSuscribirme({
  isOpen,
  onClose,
  plan,
}: ModalSuscribirmeProps) {
  const [comprobante, setComprobante] = useState('');
  const [comprobanteImg, setComprobanteImg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setComprobante('');
      setComprobanteImg('');
    }
  }, [isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setComprobanteImg(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        const reader = new FileReader();
        reader.onloadend = () => {
          setComprobanteImg(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeFile = () => {
    setComprobanteImg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comprobanteImg) {
      notify({ type: 'error', message: 'Por favor completa todos los campos' });
      return;
    }

    if (plan?.costo > 0 && !comprobante) {
      notify({ type: 'error', message: 'Por favor completa todos los campos' });
      return;
    }

    setIsLoading(true);
    try {
      await crearSuscripcionService({
        planId: plan.id,
        comprobante: plan?.costo > 0 ? parseInt(comprobante) : 0,
        comprobanteImg: comprobanteImg,
      });

      setComprobante('');
      setComprobanteImg('');
      onClose();
    } catch (error) {
      console.error('[v0] Error creating subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageLabel = () => {
    switch (plan?.tipo) {
      case TipoSuscripcion.ESTUDIANTE:
        return 'Subir constancia de estudio';
      case TipoSuscripcion.PROFESOR:
        return 'Subir constancia de trabajo';
      case TipoSuscripcion.AGREMIADO:
        return 'Subir comprobante de pago';
      default:
        return 'Subir documento';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Suscribirse a Plan {plan?.tipo}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Plan</Label>
            <div className="p-3 bg-muted rounded-md font-medium">
              {plan?.tipo}
            </div>
          </div>
          {plan?.costo > 0 && (
            <div className="space-y-2">
              <Label>Costo</Label>
              <div className="p-3 bg-muted rounded-md font-medium">
                {plan?.costo?.toFixed(2)}
              </div>
            </div>
          )}
          {plan?.costo > 0 && plan?.tipo === TipoSuscripcion.AGREMIADO && (
            <div className="space-y-2">
              <Label>Datos de Pago</Label>
              <div className="p-3 bg-muted rounded-md text-sm">
                25074591/0102/04127554970
              </div>
            </div>
          )}

          {plan?.costo > 0 && (
            <div className="space-y-2">
              <Label htmlFor="comprobante">Número de Comprobante</Label>
              <Input
                id="comprobante"
                type="number"
                placeholder="Ej: 123456"
                value={comprobante}
                onChange={(e) => setComprobante(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label>{getImageLabel()}:</Label>
            <div>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />

              <div className="relative">
                <Label
                  htmlFor="file-upload"
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${comprobanteImg ? "border-primary" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                    } cursor-pointer overflow-hidden h-[200px]`}
                >
                  {comprobanteImg ? (
                    <>
                      <img
                        src={comprobanteImg || "/placeholder.svg"}
                        alt="Comprobante"
                        className="absolute inset-0 w-full h-full object-cover z-10"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20">
                        <span className="text-white text-sm font-medium">Cambiar imagen</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 mb-3 text-muted-foreground" />
                      <span className="text-sm font-medium">Haga clic para seleccionar una imagen</span>
                      <span className="text-xs text-muted-foreground mt-1">JPG, PNG o GIF (máx. 2MB)</span>
                    </>
                  )}
                </Label>

                {comprobanteImg && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-30 rounded-full h-8 w-8"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Suscribiéndose...' : 'Suscribirse'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
