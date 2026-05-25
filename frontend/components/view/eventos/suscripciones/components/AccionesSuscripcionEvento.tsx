'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, ImageIcon } from 'lucide-react';
import { Rol, EstatusPagoEvento } from '@/global/enums';

interface AccionesSuscripcionEventoProps {
  suscripcion: any;
  rolActual: Rol;
  onVerDetalles?: (suscripcion: any) => void;
  onVerComprobante: (img: string) => void;
  onEstatusChange?: (id: number, estatus: string) => void;
}

export default function AccionesSuscripcionEvento({
  suscripcion,
  rolActual,
  onVerDetalles,
  onVerComprobante,
  onEstatusChange,
}: AccionesSuscripcionEventoProps) {
  const esAdminOSuperUsuario =
    rolActual === Rol.ADMINISTRADOR || rolActual === Rol.SUPER_USUARIO;

  return (
    <div className="flex items-center gap-2">
      {esAdminOSuperUsuario && onEstatusChange && (
        <Select
          defaultValue={suscripcion.estatus}
          onValueChange={(value) =>
            onEstatusChange(suscripcion.id, value)
          }
        >
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(EstatusPagoEvento).map((estatus) => (
              <SelectItem key={estatus} value={estatus}>
                {estatus}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {onVerDetalles && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onVerDetalles(suscripcion)}
          title="Ver detalles"
          className="h-10 w-10 bg-[#F0F0F0] text-[#333] rounded-md"
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 bg-[#F0F0F0] text-[#333] rounded-md"
        onClick={() => {
          console.log('comprobanteImg value:', suscripcion.comprobanteImg);
          onVerComprobante(suscripcion.comprobanteImg);
        }}
        title="Ver comprobante"
      >
        <ImageIcon className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
