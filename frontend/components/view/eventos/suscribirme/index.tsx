'use client';

import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import TarjetaEventoActivo from './components/TarjetaEventoActivo';
import ModalSuscribirseEvento from './components/ModalSuscribirseEvento';
import { getEventosActivosService } from './service/getEventosActivos.service';
import useEventosActivosStore from './store/eventosActivosStore';
import { useShallow } from 'zustand/react/shallow';

export default function SuscribirmeEventosSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<any>(null);
  const [eventosSuscriptos, setEventosSuscriptos] = useState<Set<number>>(new Set());

  const { eventos, eventosUsuario, cargando, error, filtro, tipoFiltro } = useEventosActivosStore(
    useShallow((state) => ({
      eventos: state.eventos,
      eventosUsuario: state.eventosUsuario,
      cargando: state.cargando,
      error: state.error,
      filtro: state.filtro,
      tipoFiltro: state.tipoFiltro,
    }))
  );

  useEffect(() => {
    getEventosActivosService();
  }, []);

  useEffect(() => {
    if (eventosUsuario?.suscripcionEventos) {
      const suscriptos = new Set(eventosUsuario.suscripcionEventos.map(s => s.eventoId));
      setEventosSuscriptos(suscriptos);
    }
  }, [eventosUsuario]);

  const filteredEventos = eventos.filter(evento => {
    const matchesFiltro = !filtro || 
      evento.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
      evento.lugar.toLowerCase().includes(filtro.toLowerCase());
    const matchesTipo = !tipoFiltro || evento.tipo === tipoFiltro;
    return matchesFiltro && matchesTipo;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {cargando ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-md" />
            ))}
          </div>
        ) : filteredEventos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay eventos disponibles para suscribirse
            </p>
          </div>
        ) : (
          <TarjetaEventoActivo
            eventos={filteredEventos}
            onSuscribirse={(evento) => {
              setSelectedEvento(evento);
              setIsModalOpen(true);
            }}
            eventosSuscriptos={eventosSuscriptos}
          />
        )}
      </div>

      <ModalSuscribirseEvento
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvento(null);
        }}
        evento={selectedEvento}
        onSuccess={() => {
          getEventosActivosService();
        }}
      />
    </div>
  );
}
