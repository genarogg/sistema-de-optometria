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
import { useToast } from '@/hooks/use-toast';


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
  const [tipo, setTipo] = useState('');
  const [costo, setCosto] = useState('');
  const [isActivo, setIsActivo] = useState('activo');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isEditMode = Boolean(plan);

  useEffect(() => {
    if (plan) {
      setTipo(plan.tipo);
      setCosto(plan.costo?.toString() || '');
      setIsActivo(plan.isActivo ? 'activo' : 'inactivo');
    } else {
      setTipo('');
      setCosto('');
      setIsActivo('activo');
    }
  }, [plan, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipo || !costo) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && plan?.id) {
        await actualizarPlanService({
          planId: plan.id,
          tipo: tipo as any,
          costo: parseFloat(costo),
          isActivo: isActivo === 'activo',
        });
      } else {
        await crearPlanService({
          tipo: tipo as any,
          costo: parseFloat(costo),
          isActivo: isActivo === 'activo',
        });
      }

      toast({
        title: 'Éxito',
        description: isEditMode
          ? 'Plan actualizado correctamente'
          : 'Plan creado correctamente',
      });

      setTipo('');
      setCosto('');
      setIsActivo('activo');
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('[v0] Error saving plan:', error);
      toast({
        title: 'Error',
        description: isEditMode
          ? 'No se pudo actualizar el plan'
          : 'No se pudo crear el plan',
        variant: 'destructive',
      });
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
            <Input
              id="tipo"
              placeholder="Ej: Plan Premium"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="costo">Costo</Label>
            <Input
              id="costo"
              type="number"
              step="0.01"
              placeholder="Ej: 99.99"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
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
