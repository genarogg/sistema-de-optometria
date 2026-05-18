'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ImageIcon, CreditCard, ShieldCheck, Receipt } from 'lucide-react';
import { EstatusSuscripcion, Rol, TipoDeDocumento } from '@/global/enums';
import WhatsappButton from '@/components/ux/btn/whatsapp';
import downloadDocumentoService  from '../service/downloadDocumento.service';

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
  const [downloading, setDownloading] = useState<Partial<Record<TipoDeDocumento, boolean>>>({});
  const esAdminOSuperUsuario =
    rolActual === Rol.ADMINISTRADOR || rolActual === Rol.SUPER_USUARIO;

  const handleDownloadDocumento = async (tipo: TipoDeDocumento) => {
    if (downloading[tipo]) return;
    
    const setDownloadingType = (docType: TipoDeDocumento, isDownloading: boolean) => {
      setDownloading(prev => ({
        ...prev,
        [docType]: isDownloading
      }));
    };

    downloadDocumentoService({
      tipo,
      suscripcionId: suscripcion.id,
      usuario: suscripcion.usuario,
      setDownloading: setDownloadingType,
    });
  };

  return (
    <>
      {/* Botón Ver detalles */}
      {onVerDetalles && (
        <Button
          variant="outline"
          size="icon"
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
          disabled={downloading[TipoDeDocumento.CARNET]}
          onClick={() => handleDownloadDocumento(TipoDeDocumento.CARNET)}
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
          disabled={downloading[TipoDeDocumento.SOLVENCIA_PAGO]}
          onClick={() => handleDownloadDocumento(TipoDeDocumento.SOLVENCIA_PAGO)}
          title="Descargar solvencia"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* Botón Descargar recibo - solo PENDIENTE */}
      {/* {suscripcion.estatus === EstatusSuscripcion.PENDIENTE && (
        <Button
          variant="outline"
          size="icon"
          
          title="Descargar recibo"
        >
          <Receipt className="h-3.5 w-3.5" />
        </Button>
      )} */}
    </>
  );
}