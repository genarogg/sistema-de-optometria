'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, ImageIcon, Award } from 'lucide-react';
import { Rol, EstatusPagoEvento } from '@/global/enums';
import downloadCertificadoService from '../service/downloadCertificado.service';

interface AccionesSuscripcionEventoProps {
  suscripcion: any;
  rolActual: Rol;
  onVerDetalles?: (suscripcion: any) => void;
  onVerComprobante: (img: string) => void;
  onEstatusChange?: (id: number, estatus: EstatusPagoEvento) => void;
}

export default function AccionesSuscripcionEvento({
  suscripcion,
  rolActual,
  onVerDetalles,
  onVerComprobante,
  onEstatusChange,
}: AccionesSuscripcionEventoProps) {
  const [downloading, setDownloading] = useState(false);
  const esAdminOSuperUsuario =
    rolActual === Rol.ADMINISTRADOR || rolActual === Rol.SUPER_USUARIO;

  // Verificar si la fecha del evento es <= fecha actual
  const esFechaEventoPasada = () => {
    if (!suscripcion.evento?.fecha) return false;
    const fechaEvento = new Date(suscripcion.evento.fecha);
    const fechaActual = new Date();
    // Establecemos la hora a medianoche para comparar solo fechas
    fechaActual.setHours(0, 0, 0, 0);
    fechaEvento.setHours(0, 0, 0, 0);
    return fechaEvento <= fechaActual;
  };

  // Obtener los estatus disponibles según la fecha del evento
  const estatusDisponibles = Object.values(EstatusPagoEvento).filter((estatus) => {
    // Si la fecha del evento no ha pasado, ocultamos ASISTIO y NO_ASISTIO
    if (!esFechaEventoPasada()) {
      return estatus !== EstatusPagoEvento.ASISTIO && estatus !== EstatusPagoEvento.NO_ASISTIO;
    }
    // Si la fecha ya pasó, mostramos todos los estatus
    return true;
  });

  const handleDownloadCertificado = async () => {
    if (downloading) return;

    await downloadCertificadoService({
      usuarioId: suscripcion.usuario.id,
      eventoId: suscripcion.evento.id,
      usuario: suscripcion.usuario,
      evento: suscripcion.evento,
      setDownloading,
    });
  };

  return (
    <div className="flex items-center gap-2">
      {esAdminOSuperUsuario && onEstatusChange && (
        <Select
          defaultValue={suscripcion.estatus}
          onValueChange={(value) =>
            onEstatusChange(suscripcion.id, value as EstatusPagoEvento)
          }
        >
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {estatusDisponibles.map((estatus) => (
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

      {/* Botón Descargar certificado - solo si el usuario asistió y es admin/super usuario */}
      {(suscripcion.estatus === EstatusPagoEvento.ASISTIO) && esAdminOSuperUsuario && (
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 bg-[#F0F0F0] text-[#333] rounded-md"
          disabled={downloading}
          onClick={handleDownloadCertificado}
          title="Descargar certificado"
        >
          <Award className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
