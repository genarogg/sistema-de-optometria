'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { actualizarPlanService } from '../service/actualizarPlan.service';
import { crearPlanService } from '../service/crearPlan.service';
import { TipoSuscripcion } from '@/global/enums';
import notify from '@/components/nano/notify';


interface ModalCrearPlanProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  plan?: any;
}

export default function ModalCrearPlan({
  isOpen,
  onClose,
  plan,
  onSuccess,
}: ModalCrearPlanProps) {
  const [tipo, setTipo] = useState<TipoSuscripcion | ''>('');
  const [costo, setCosto] = useState(0);
  const [isActivo, setIsActivo] = useState('activo');
  const [isLoading, setIsLoading] = useState(false);
  const [costoInput, setCostoInput] = useState<HTMLInputElement | null>(null);

  const isEditMode = Boolean(plan);

  // Inicializar money inputs y escuchar eventos
  useEffect(() => {
    if (!costoInput) return;

    const handleMoneyInput = (e: CustomEvent<{ value: number }>) => {
      setCosto(e.detail.value);
    };

    costoInput.addEventListener('money-input', handleMoneyInput as EventListener);
    return () => costoInput.removeEventListener('money-input', handleMoneyInput as EventListener);
  }, [costoInput]);

  // Sincronizar valores al abrir el modal
  useEffect(() => {
    if (!costoInput) return;

    if (plan) {
      setTipo(plan.tipo);
      setIsActivo(plan.isActivo ? 'activo' : 'inactivo');

      const cents = plan.costo ?? 0;
      setCosto(cents);
      setTimeout(() => (costoInput as any).setCents?.(cents, false), 0);
    } else {
      setTipo('');
      setIsActivo('activo');
      setCosto(0);
      setTimeout(() => (costoInput as any).setCents?.(0, false), 0);
    }
  }, [plan, isOpen, costoInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(costo)
    if (!tipo || costo <= 0) {
      notify({ type: 'error', message: 'Por favor completa todos los campos' });
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && plan?.id) {
        await actualizarPlanService({
          planId: plan.id,
          tipo: tipo as TipoSuscripcion,
          costo: costo,
          isActivo: isActivo === 'activo',
        });
      } else {
        await crearPlanService({
          tipo: tipo as TipoSuscripcion,
          costo: costo,
          isActivo: isActivo === 'activo',
        });
      }

      setTipo('');
      setCosto(0);
      setIsActivo('activo');
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('[v0] Error saving plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const title = isEditMode ? 'Editar Plan' : 'Crear Nuevo Plan';
  const submitLabel = isEditMode ? 'Actualizar Plan' : 'Crear Plan';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Plan</Label>
            <Select
              value={tipo}
              onValueChange={(value) => setTipo(value as TipoSuscripcion)}
              disabled={isLoading}
            >
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TipoSuscripcion).map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="costo">Costo</Label>
            <Input
              ref={(el) => setCostoInput(el)}
              id="costo"
              type="money"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isActivo">Estado</Label>
            <Select value={isActivo} onValueChange={setIsActivo} disabled={isLoading}>
              <SelectTrigger id="isActivo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
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
              {isLoading ? `${submitLabel}...` : submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}