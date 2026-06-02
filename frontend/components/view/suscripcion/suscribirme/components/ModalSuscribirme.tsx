'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TipoSuscripcion } from '@/global/enums';
import { crearSuscripcionService } from '../service/crearSuscripcion.service';
import notify from '@/components/nano/notify';
import { Upload, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';

const bankInfo = {
  banco: "Banco de Venezuela",
  rif: "J-306668098",
  telefono: "04127554970",
  beneficiario: "Centro de Optometria",
}

interface ModalSuscribirmeProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
  onSubscriptionSuccess?: () => void;
}

export default function ModalSuscribirme({
  isOpen,
  onClose,
  plan,
  onSubscriptionSuccess,
}: ModalSuscribirmeProps) {
  const [comprobante, setComprobante] = useState('');
  const [comprobanteImg, setComprobanteImg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setComprobante('');
      setComprobanteImg('');
      setIsSuccess(false);
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

      setIsSuccess(true);
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
      {isSuccess ? (
        <DialogContent className="sm:max-w-[500px] p-0 border-0 overflow-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="relative w-full h-full bg-gradient-hero rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 10 + 5,
                    height: Math.random() * 10 + 5,
                    backgroundColor: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1
                      })`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, Math.random() * 20 - 10, 0],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center p-8 h-[420px]">
              <motion.div
                className="relative mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <Check className="h-12 w-12 text-primary" strokeWidth={3} />
                  </motion.div>
                </div>

                {[1, 2, 3].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-white"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                      delay: i * 0.4,
                    }}
                  />
                ))}
              </motion.div>

              <motion.h2
                className="text-3xl font-bold text-white mb-3 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                ¡Suscripción Exitosa!
              </motion.h2>

              <motion.p
                className="text-white/90 text-center max-w-xs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Su suscripción ha sido procesada exitosamente
              </motion.p>

              <motion.p
                className="text-sm text-white text-center max-w-sm mt-4 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <strong>
                  Nota: Su suscripción ya está siendo procesada, no es
                  necesario ir a las instalaciones. puede consultar el estatus en <span className="font-semibold">Suscripciones</span>.
                </strong>
              </motion.p>

              <motion.div
                className="w-16 h-1 bg-white/50 rounded-full mt-6"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="mt-8"
              >
                <Button
                  onClick={() => {
                    localStorage.setItem('suscripcionActiveTab', 'suscripciones');
                    onClose();
                    onSubscriptionSuccess?.();
                  }}
                  className="bg-white text-primary hover:text-primary-foreground transition-all px-8 py-2 rounded-full font-medium"
                >
                  Ir a Suscripciones
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </DialogContent>
      ) : (
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Suscribirse a Plan {plan?.tipo}</DialogTitle>
          </DialogHeader>

          <div className="overflow-x-auto mb-4 rounded-lg border">
            <Table className="w-full">
              <TableBody>
                <TableRow className="hover:bg-muted/30">
                  <TableCell className="font-medium text-[14px] p-3 bg-muted/50 w-1/3">Tipo de Plan</TableCell>
                  <TableCell className="text-[14px] p-3">{plan?.tipo}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-muted/30">
                  <TableCell className="font-medium text-[14px] p-3 bg-muted/50">Costo</TableCell>
                  <TableCell className="text-[14px] p-3">{plan?.costo > 0 ? `Bs ${plan?.costo?.toFixed(2)}` : 'Sin Costo'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {plan?.costo > 0 && (
            <div className="overflow-x-auto mb-6 rounded-lg border">
              <Table className="w-full">
                <TableBody>
                  <TableRow className="hover:bg-muted/30">
                    <TableCell className="font-medium text-[14px] p-3 bg-muted/50 w-1/3">Banco</TableCell>
                    <TableCell className="text-[14px] p-3">{bankInfo.banco}</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-muted/30">
                    <TableCell className="font-medium text-[14px] p-3 bg-muted/50">RIF:</TableCell>
                    <TableCell className="text-[14px] p-3">{bankInfo.rif}</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-muted/30">
                    <TableCell className="font-medium text-[14px] p-3 bg-muted/50">Telefono:</TableCell>
                    <TableCell className="text-[14px] p-3">{bankInfo.telefono}</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-muted/30">
                    <TableCell className="font-medium text-[14px] p-3 bg-muted/50">A Nombre de:</TableCell>
                    <TableCell className="text-[14px] p-3">{bankInfo.beneficiario}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  maxLength={8}
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
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Suscribiéndose...' : 'Suscribirse'}
              </Button>
            </div>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
