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
import { Badge } from '@/components/ui/badge';

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

  const getStatusColor = (isActivo: boolean | undefined) => {
    return isActivo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  if (planes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay planes disponibles</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planes.map((plan) => (
              <TableRow key={plan.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-sm">{plan.id}</TableCell>
                <TableCell className="font-medium">{plan.tipo}</TableCell>
                <TableCell>${plan.costo?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(plan.isActivo)}>
                    {plan.isActivo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
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

    </>
  );
}
