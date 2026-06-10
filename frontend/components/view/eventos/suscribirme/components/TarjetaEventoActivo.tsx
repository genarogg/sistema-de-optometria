'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, UsersRound, CheckCircle, RefreshCw, Award, FileText } from 'lucide-react';
import { TipoEvento, Rol, EstatusPagoEvento } from '@/global/enums';
import { useAuthStore } from '@/context/auth/AuthContext';
import { showMoney } from 'supermoney';
import downloadCertificadoService from '../service/downloadCertificado.service';
import downloadCarnetEventoService from '../service/downloadCarnetEvento.service';

interface Evento {
  id: number;
  nombre: string;
  fecha: Date;
  lugar: string;
  costo: number;
  descuentoEstudiante: number;
  descuentoProfesor: number;
  tipo: string;
  vigencia: string;
  aliadoInstitucionImg?: string;
  aliadoInstitucionNombre?: string;
  aliadoAutorizoFirmaImg?: string;
  aliadoAutorizoNombreFirma?: string;
  aliadoAutorizoCargo?: string;
  ponenteEvento: any[];
}

interface TarjetaEventoActivoProps {
  eventos: Evento[];
  onSuscribirse: (evento: Evento) => void;
  suscripcionesMap: Map<number, EstatusPagoEvento>;
}

export default function TarjetaEventoActivo({ eventos, onSuscribirse, suscripcionesMap }: TarjetaEventoActivoProps) {
  const { usuario } = useAuthStore();
  const [downloadingMap, setDownloadingMap] = useState<Map<number, boolean>>(new Map());
  const [downloadingCarnetMap, setDownloadingCarnetMap] = useState<Map<number, boolean>>(new Map());

  console.log(eventos)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calcularPrecio = (evento: Evento) => {
    let descuento = 0;

    if (usuario?.rol === Rol.ESTUDIANTE) {
      descuento = evento.descuentoEstudiante;
    } else if (usuario?.rol === Rol.PROFESOR) {
      descuento = evento.descuentoProfesor;
    } else if (usuario?.rol === Rol.AGREMIADO_SOLVENTE) {
      descuento = 50;
    }

    return Math.round(evento.costo * (1 - descuento / 100));
  };

  const getDescuentoTexto = (evento: Evento) => {
    if (!usuario?.rol) return null;

    if (usuario.rol === Rol.ESTUDIANTE && evento.descuentoEstudiante > 0) {
      return `Descuento estudiante: ${evento.descuentoEstudiante}%`;
    }
    if (usuario.rol === Rol.PROFESOR && evento.descuentoProfesor > 0) {
      return `Descuento profesor: ${evento.descuentoProfesor}%`;
    }
    if (usuario.rol === Rol.AGREMIADO_SOLVENTE) {
      return `Descuento agremiado solvente: 50%`;
    }
    return null;
  };

  const getEstadoSuscripcion = (eventoId: number) => {
    return suscripcionesMap.get(eventoId);
  };

  const getBotonConfig = (evento: Evento) => {
    const estatus = getEstadoSuscripcion(evento.id);

    if (!estatus) {
      return {
        variant: "default" as const,
        disabled: false,
        texto: "Suscribirme",
        icono: null
      };
    }

    if (estatus === EstatusPagoEvento.RECHAZADO) {
      return {
        variant: "default" as const,
        disabled: false,
        texto: "Suscribirme de nuevo",
        icono: <RefreshCw className="h-4 w-4 mr-2" />
      };
    }

    if (estatus === EstatusPagoEvento.PENDIENTE) {
      return {
        variant: "secondary" as const,
        disabled: true,
        texto: "Pendiente",
        icono: null
      };
    }

    if (estatus === EstatusPagoEvento.PAGADO) {
      return {
        variant: "secondary" as const,
        disabled: true,
        texto: "Suscripto",
        icono: <CheckCircle className="h-4 w-4 mr-2" />
      };
    }

    if (estatus === EstatusPagoEvento.NO_ASISTIO) {
      return {
        variant: "secondary" as const,
        disabled: true,
        texto: "No Asistió",
        icono: null
      };
    }

    return {
      variant: "default" as const,
      disabled: false,
      texto: "Suscribirme",
      icono: null
    };
  };

  const handleDownloadCertificado = async (evento: Evento) => {
    if (!usuario) return;
    if (downloadingMap.get(evento.id)) return;

    setDownloadingMap(prev => new Map(prev).set(evento.id, true));

    await downloadCertificadoService({
      eventoId: evento.id,
      usuario: usuario,
      evento: {
        tipo: evento.tipo as TipoEvento,
        nombre: evento.nombre,
      },
      setDownloading: (val) => {
        setDownloadingMap(prev => new Map(prev).set(evento.id, val));
      },
    });
  };

  const handleDownloadCarnet = async (eventoId: number) => {
    if (!usuario) return;
    if (downloadingCarnetMap.get(eventoId)) return;

    setDownloadingCarnetMap(prev => new Map(prev).set(eventoId, true));

    await downloadCarnetEventoService({
      eventoId: eventoId,
      setDownloading: (val) => {
        setDownloadingCarnetMap(prev => new Map(prev).set(eventoId, val));
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {eventos.map((evento) => {
        const precio = calcularPrecio(evento);
        const descuentoTexto = getDescuentoTexto(evento);
        const botonConfig = getBotonConfig(evento);
        const estatus = getEstadoSuscripcion(evento.id);

        return (
          <Card key={evento.id} className="w-full">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{evento.nombre}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{evento.tipo}</Badge>
                    {estatus && (
                      <Badge variant={
                        estatus === EstatusPagoEvento.PAGADO ? "default" :
                          estatus === EstatusPagoEvento.PENDIENTE ? "default" :
                            estatus === EstatusPagoEvento.RECHAZADO ? "destructive" :
                              estatus === EstatusPagoEvento.NO_ASISTIO ? "destructive" : "outline"
                      }>
                        {estatus}
                      </Badge>
                    )}
                  </div>
                </div>

              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(evento.fecha)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {evento.lugar}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UsersRound className="h-4 w-4" />
                  {evento.ponenteEvento.length} ponente{evento.ponenteEvento.length !== 1 ? 's' : ''}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Precio: </span>
                  <span className="font-semibold text-lg text-primary">$ {showMoney(precio)}</span>
                  {!usuario?.rol && evento.costo !== precio && (
                    <span className="text-xs text-muted-foreground line-through ml-2">
                      $ {showMoney(evento.costo)}
                    </span>
                  )}
                </div>
              </div>
              {descuentoTexto && (
                <div className="mt-3 pt-3 border-t">
                  <Badge variant="secondary" className="text-xs">
                    {descuentoTexto}
                  </Badge>
                </div>
              )}
              {(evento.aliadoInstitucionNombre || evento.aliadoInstitucionImg) && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium mb-2">Alianza:</p>
                  <div className="flex items-center gap-3">
                    {evento.aliadoInstitucionImg && (
                      <img
                        src={evento.aliadoInstitucionImg}
                        alt={evento.aliadoInstitucionNombre || 'Aliado'}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                    )}
                    {evento.aliadoInstitucionNombre && (
                      <span className="text-sm font-medium">{evento.aliadoInstitucionNombre}</span>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-end items-center mt-4 gap-2 border-t pt-4">
                {estatus === EstatusPagoEvento.ASISTIO && usuario && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadCertificado(evento)}
                    disabled={downloadingMap.get(evento.id)}
                    title="Descargar certificado"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Certificado
                  </Button>
                )}
                {estatus === EstatusPagoEvento.PAGADO && usuario && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadCarnet(evento.id)}
                    disabled={downloadingCarnetMap.get(evento.id)}
                    title="Descargar carnet"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Carnet
                  </Button>
                )}
                {estatus !== EstatusPagoEvento.NO_ASISTIO && estatus !== EstatusPagoEvento.ASISTIO && (
                  <Button
                    variant={botonConfig.variant}
                    size="sm"
                    onClick={() => botonConfig.disabled ? null : onSuscribirse(evento)}
                    disabled={botonConfig.disabled}
                  >
                    <div className="flex items-center gap-2">
                      {botonConfig.icono}
                      {botonConfig.texto}
                    </div>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
