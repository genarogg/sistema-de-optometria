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
import { CreditCard } from 'lucide-react';
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

  const handleDownloadCarnet = async (ponente: PonenteEvento) => {
    await downloadCarnetPonenteService({
      usuarioId: ponente.usuarioId,
      eventoId: evento.id,
      usuario: ponente.usuario,
      setDownloading: (isDownloading) => 
        setDownloading(isDownloading ? ponente.usuarioId : null),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Ponentes del evento: {evento.nombre}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {evento.ponenteEvento.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay ponentes asignados a este evento.
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
                  <TableRow key={ponente.id}>
                    <TableCell className="font-medium">
                      {ponente.usuario.primerNombre} {ponente.usuario.primerApellido}
                    </TableCell>
                    <TableCell>{ponente.usuario.cedula}</TableCell>
                    <TableCell>
                      {ponente.isActivo ? (
                        <span className="text-green-600 font-medium">Activo</span>
                      ) : (
                        <span className="text-red-600 font-medium">Inactivo</span>
                      )}
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
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
