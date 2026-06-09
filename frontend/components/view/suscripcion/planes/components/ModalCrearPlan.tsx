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
import MoneyInput from '@/components/nano/MoneyInput';
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


  const isEditMode = Boolean(plan);



  // Sincronizar valores al abrir el modal
  useEffect(() => {
    if (plan) {
      setTipo(plan.tipo);
      setIsActivo(plan.isActivo ? 'activo' : 'inactivo');
      setCosto(plan.costo ?? 0);
    } else {
      setTipo('');
      setIsActivo('activo');
      setCosto(0);
    }
  }, [plan, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(costo)
    if (!tipo || costo < 0) {
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
            <MoneyInput
              id="costo"
              value={costo}
              onChange={setCosto}
              disabled={isLoading}
              symbol="Bs."
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

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} variant="outline">
              {isLoading ? `${submitLabel}...` : submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}