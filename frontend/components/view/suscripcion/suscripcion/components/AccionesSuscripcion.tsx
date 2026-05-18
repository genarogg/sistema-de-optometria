'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ImageIcon, CreditCard, ShieldCheck, Receipt } from 'lucide-react';
import { EstatusSuscripcion, Rol } from '@/global/enums';
import WhatsappButton from '@/components/ux/btn/whatsapp';

interface AccionesSuscripcionProps {
  suscripcion: any;
  rolActual: Rol;
  onVerDetalles?: (id: number) => void;
  onVerComprobante: (img: string) => void;
}

export default function AccionesSuscripcion({
  suscripcion,
  rolActual,
  onVerDetalles,
  onVerComprobante,
}: AccionesSuscripcionProps) {
  const esAdminOSuperUsuario =
    rolActual === Rol.ADMINISTRADOR || rolActual === Rol.SUPER_USUARIO;

  return (
    <>
      {/* Botón Ver detalles */}
      {onVerDetalles && (
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => onVerDetalles(suscripcion.id)}
          title="Ver detalles"
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* Botón WhatsApp - solo admin */}
      {esAdminOSuperUsuario && (
        <WhatsappButton phoneNumber={suscripcion.usuario.telefono} />
      )}

      {/* Botón Ver comprobante */}
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10"
        onClick={() => onVerComprobante(suscripcion.comprobanteImg)}
        title="Ver comprobante"
      >
        <ImageIcon className="h-3.5 w-3.5" />
      </Button>

      {/* Botón Descargar carnet - solo VALIDADO */}
      {suscripcion.estatus === EstatusSuscripcion.VALIDADO && (
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          title="Descargar carnet"
        >
          <CreditCard className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* Botón Descargar solvencia - solo VALIDADO */}
      {suscripcion.estatus === EstatusSuscripcion.VALIDADO && (
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          title="Descargar solvencia"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* Botón Descargar recibo - solo PENDIENTE */}
      {suscripcion.estatus === EstatusSuscripcion.PENDIENTE && (
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          title="Descargar recibo"
        >
          <Receipt className="h-3.5 w-3.5" />
        </Button>
      )}
    </>
  );
}