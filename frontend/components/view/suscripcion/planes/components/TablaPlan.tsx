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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

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
              <TableCell className="text-sm">${plan.costo?.toFixed(2) || '0.00'}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs">
                  {plan.isActivo ? 'Activo' : 'Inactivo'}
                </span>
              </TableCell>
              <TableCell className="flex items-center justify-center">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
