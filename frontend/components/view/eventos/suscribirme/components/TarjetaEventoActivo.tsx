'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, UsersRound, CheckCircle } from 'lucide-react';
import { TipoEvento, Rol } from '@/global/enums';
import { useAuthStore } from '@/context/auth/AuthContext';

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
  ponenteEvento: any[];
}

interface TarjetaEventoActivoProps {
  eventos: Evento[];
  onSuscribirse: (evento: Evento) => void;
  eventosSuscriptos: Set<number>;
}

export default function TarjetaEventoActivo({ eventos, onSuscribirse, eventosSuscriptos }: TarjetaEventoActivoProps) {
  const { usuario } = useAuthStore();

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
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      {eventos.map((evento) => {
        const precio = calcularPrecio(evento);
        const descuentoTexto = getDescuentoTexto(evento);
        const estaSuscripto = eventosSuscriptos.has(evento.id);

        return (
          <Card key={evento.id} className="w-full">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{evento.nombre}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{evento.tipo}</Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant={estaSuscripto ? "secondary" : "default"} 
                    size="sm" 
                    onClick={() => !estaSuscripto && onSuscribirse(evento)}
                    disabled={estaSuscripto}
                  >
                    {estaSuscripto ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Suscripto
                      </div>
                    ) : "Suscribirme"}
                  </Button>
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
                  <span className="font-semibold text-lg text-primary">${precio.toLocaleString()}</span>
                  {evento.costo !== precio && (
                    <span className="text-xs text-muted-foreground line-through ml-2">
                      ${evento.costo.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              {descuentoTexto && (
                <div className="mt-3 pt-3 border-t">
                  <Badge variant="default" className="text-xs">
                    {descuentoTexto}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
