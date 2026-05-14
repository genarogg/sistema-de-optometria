'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

interface TarjetaPlanProps {
  planes: any[];
  onDelete?: (id: number) => void;
  onEdit?: (plan: any) => void;
}

export default function TarjetaPlan({
  planes,
  onDelete,
  onEdit,
}: TarjetaPlanProps) {

  if (planes.length === 0) {
    return (
      <p className="text-center py-10 text-muted-foreground text-sm">
        No hay planes disponibles
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {planes.map((plan) => (
        <Card key={plan.id} className="shadow-sm gap-0">
          <CardHeader className="py-2 px-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="tracking-tight text-base font-medium">
                  {plan.tipo}
                </CardTitle>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {plan.isActivo ? 'Activo' : 'Inactivo'}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(plan)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(plan.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="flex flex-col gap-2 text-sm">
              <div>
                <span className="font-medium">ID:</span> {plan.id}
              </div>
              <div>
                <span className="font-medium">Costo:</span> ${plan.costo?.toFixed(2) || '0.00'}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
