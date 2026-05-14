'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Edit, Trash2 } from 'lucide-react';

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
      <div className="grid grid-cols-1 gap-4">
        {planes.map((plan) => (
          <Card key={plan.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg">{plan.tipo}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">ID: {plan.id}</p>
                </div>
                <Badge className={getStatusColor(plan.isActivo)}>
                  {plan.isActivo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Costo:</span>
                <span className="font-semibold text-lg">
                  ${plan.costo?.toFixed(2) || '0.00'}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit?.(plan)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => onDelete(plan.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </>
  );
}
