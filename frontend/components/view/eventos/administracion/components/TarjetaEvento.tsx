'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Calendar, MapPin, Users, UsersRound } from 'lucide-react';
import { TipoEvento, VigenciaEvento } from '@/global/enums';

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

interface TarjetaEventoProps {
  eventos: Evento[];
  onEdit: (evento: Evento) => void;
  onVerPonentes: (evento: Evento) => void;
}

export default function TarjetaEvento({ eventos, onEdit, onVerPonentes }: TarjetaEventoProps) {
  const getVigenciaColor = (vigencia: string) => {
    switch (vigencia) {
      case VigenciaEvento.VIGENTE:
        return 'default';
      case VigenciaEvento.CANCELADO:
        return 'destructive';
      case VigenciaEvento.CONCLUIDO:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {eventos.map((evento) => (
        <Card key={evento.id} className="w-full">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{evento.nombre}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getVigenciaColor(evento.vigencia)}>
                    {evento.vigencia}
                  </Badge>
                  <Badge variant="outline">{evento.tipo}</Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => onVerPonentes(evento)}>
                  <UsersRound className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(evento)}>
                  <Edit className="h-4 w-4" />
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
                <Users className="h-4 w-4" />
                {evento.ponenteEvento.length} ponente{evento.ponenteEvento.length !== 1 ? 's' : ''}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Costo: </span>
                <span className="font-semibold">${evento.costo.toLocaleString()}</span>
              </div>
            </div>
            {(evento.descuentoEstudiante > 0 || evento.descuentoProfesor > 0) && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm font-medium mb-1">Descuentos:</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {evento.descuentoEstudiante > 0 && (
                    <span>Estudiantes: {evento.descuentoEstudiante}%</span>
                  )}
                  {evento.descuentoProfesor > 0 && (
                    <span>Profesores: {evento.descuentoProfesor}%</span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
