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
  variant?: 'icon' | 'text';
}

export default function AccionesSuscripcion({
  suscripcion,
  rolActual,
  onVerDetalles,
  onVerComprobante,
  variant = 'icon',
}: AccionesSuscripcionProps) {
  const esAdminOSuperUsuario =
    rolActual === Rol.ADMINISTRADOR || rolActual === Rol.SUPER_USUARIO;

  if (variant === 'text') {
    return (
      <>
        {/* Botón Ver detalles */}
        {onVerDetalles && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs flex-1"
            onClick={() => onVerDetalles(suscripcion.id)}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Detalles
          </Button>
        )}

        {/* Botón WhatsApp - solo admin */}
        {esAdminOSuperUsuario && (
          <WhatsappButton
            phoneNumber={suscripcion.usuario.telefono}
          />
        )}

        {/* Botón Ver comprobante */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs flex-1"
          onClick={() => onVerComprobante(suscripcion.comprobanteImg)}
        >
          <ImageIcon className="h-3.5 w-3.5 mr-1" />
          Comprobante
        </Button>

        {/* Botón Descargar carnet - solo VALIDADO */}
        {suscripcion.estatus === EstatusSuscripcion.VALIDADO && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs flex-1"
          >
            <CreditCard className="h-3.5 w-3.5 mr-1" />
            Carnet
          </Button>
        )}

        {/* Botón Descargar solvencia - solo VALIDADO */}
        {suscripcion.estatus === EstatusSuscripcion.VALIDADO && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs flex-1"
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            Solvencia
          </Button>
        )}

        {/* Botón Descargar recibo - solo PENDIENTE */}
        {suscripcion.estatus === EstatusSuscripcion.PENDIENTE && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs flex-1"
          >
            <Receipt className="h-3.5 w-3.5 mr-1" />
            Recibo
          </Button>
        )}
      </>
    );
  }

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