'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ImageIcon } from 'lucide-react';
import { Rol } from '@/global/enums';

interface AccionesSuscripcionEventoProps {
  suscripcion: any;
  rolActual: Rol;
  onVerDetalles?: (suscripcion: any) => void;
  onVerComprobante: (img: string) => void;
}

export default function AccionesSuscripcionEvento({
  suscripcion,
  rolActual,
  onVerDetalles,
  onVerComprobante,
}: AccionesSuscripcionEventoProps) {
  const esAdminOSuperUsuario =
    rolActual === Rol.ADMINISTRADOR || rolActual === Rol.SUPER_USUARIO;

  return (
    <>
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
        onClick={() => onVerComprobante(suscripcion.comprobanteImg)}
        title="Ver comprobante"
      >
        <ImageIcon className="h-3.5 w-3.5" />
      </Button>
    </>
  );
}
