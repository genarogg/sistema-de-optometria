'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import downloadCarnetPonenteService from '../service/downloadCarnetPonente.service';

interface PonenteEvento {
  id: number;
  usuarioId: number;
  isActivo: boolean;
  usuario: {
    primerNombre: string;
    primerApellido: string;
    cedula: string;
  };
}

interface Evento {
  id: number;
  nombre: string;
  ponenteEvento: PonenteEvento[];
}

interface ModalPonentesEventoProps {
  isOpen: boolean;
  onClose: () => void;
  evento: Evento;
}

export default function ModalPonentesEvento({
  isOpen,
  onClose,
  evento,
}: ModalPonentesEventoProps) {
  const [downloading, setDownloading] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const handleDownloadCarnet = async (ponente: PonenteEvento) => {
    await downloadCarnetPonenteService({
      usuarioId: ponente.usuarioId,
      eventoId: evento.id,
      usuario: ponente.usuario,
      setDownloading: (isDownloading) => 
        setDownloading(isDownloading ? ponente.usuarioId : null),
    });
  };

  const PonenteCard = ({ ponente }: { ponente: PonenteEvento }) => (
    <Card key={ponente.id} className="mb-3">
      <CardContent className="pt-4">
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-semibold text-lg">
              {ponente.usuario.primerNombre} {ponente.usuario.primerApellido}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              C.I: {ponente.usuario.cedula}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <Badge variant={ponente.isActivo ? 'default' : 'destructive'}>
                {ponente.isActivo ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadCarnet(ponente)}
              disabled={downloading === ponente.usuarioId}
              className="w-full sm:w-auto"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {downloading === ponente.usuarioId ? 'Descargando...' : 'Descargar Carnet'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PonenteTableRow = ({ ponente }: { ponente: PonenteEvento }) => (
    <TableRow key={ponente.id}>
      <TableCell className="font-medium">
        {ponente.usuario.primerNombre} {ponente.usuario.primerApellido}
      </TableCell>
      <TableCell>{ponente.usuario.cedula}</TableCell>
      <TableCell>
        <Badge variant={ponente.isActivo ? 'default' : 'destructive'}>
          {ponente.isActivo ? 'Activo' : 'Inactivo'}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownloadCarnet(ponente)}
          disabled={downloading === ponente.usuarioId}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {downloading === ponente.usuarioId ? 'Descargando...' : 'Descargar Carnet'}
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-4xl ${isMobile ? 'max-w-[95vw] p-4' : ''}`}>
        <DialogHeader>
          <DialogTitle className={isMobile ? 'text-lg' : ''}>
            Ponentes del evento: {evento.nombre}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {evento.ponenteEvento.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay ponentes asignados a este evento.
            </div>
          ) : isMobile ? (
            <div className="space-y-2">
              {evento.ponenteEvento.map((ponente) => (
                <PonenteCard key={ponente.id} ponente={ponente} />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre y Apellido</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evento.ponenteEvento.map((ponente) => (
                  <PonenteTableRow key={ponente.id} ponente={ponente} />
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
