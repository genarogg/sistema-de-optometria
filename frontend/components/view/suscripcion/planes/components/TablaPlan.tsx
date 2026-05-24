'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import { Pencil } from 'lucide-react';
import { actualizarPlanService } from '../service/actualizarPlan.service';
import { showMoney } from '@/functions/super-money';

interface TablaPlanProps {
  planes: any[];
  onDelete?: (id: number) => void;
  onEdit?: (plan: any) => void;
}

export default function TablaPlan({
  planes,
  onDelete,
  onEdit,
}: TablaPlanProps) {

  const handleToggleStatus = async (plan: any) => {
    await actualizarPlanService({
      planId: plan.id,
      isActivo: !plan.isActivo,
    });
  };

  if (planes.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No hay planes disponibles
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="w-[80px] text-sm font-semibold">ID</TableHead>
            <TableHead className="text-sm font-semibold">Tipo</TableHead>
            <TableHead className="text-sm font-semibold">Costo</TableHead>
            <TableHead className="text-sm font-semibold">Estado</TableHead>
            <TableHead className="text-sm font-semibold text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {planes.map((plan, index) => (
            <TableRow
              key={plan.id}
              className={`transition-colors hover:bg-primary/20 ${
                index % 2 === 0 ? "bg-background" : "bg-muted/80"
              }`}
            >
              <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-[80px]">
                {plan.id}
              </TableCell>
              <TableCell className="font-medium">{plan.tipo}</TableCell>
              <TableCell className="text-sm">Bs {showMoney(plan.costo || 0)}</TableCell>
              <TableCell>
                <Switch
                  checked={plan.isActivo}
                  onCheckedChange={() => handleToggleStatus(plan)}
                />
              </TableCell>
              <TableCell className="flex items-center justify-center">
                <Button
                  variant="outline"
                  size="icon"
           
                  className="h-10 w-10 bg-[#F0F0F0] text-[#333] rounded-md"
                  onClick={() => onEdit?.(plan)}
                  title="Editar plan"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
