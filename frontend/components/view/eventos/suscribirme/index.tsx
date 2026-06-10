'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import TarjetaEventoActivo from './components/TarjetaEventoActivo';
import ModalSuscribirseEvento from './components/ModalSuscribirseEvento';
import EventosPagination from './components/EventosPagination';
import { getEventosActivosService } from './service/getEventosActivos.service';
import useEventosActivosStore from './store/eventosActivosStore';
import { useShallow } from 'zustand/react/shallow';
import { EstatusPagoEvento } from '@/global/enums';

export default function SuscribirmeEventosSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<any>(null);

  const { eventos, suscripcionesEventoUsuario, cargando, error, filtro, tipoFiltro, paginaActual, totalPaginas, setPaginaActual } = useEventosActivosStore(
    useShallow((state) => ({
      eventos: state.eventos,
      suscripcionesEventoUsuario: state.suscripcionesEventoUsuario,
      cargando: state.cargando,
      error: state.error,
      filtro: state.filtro,
      tipoFiltro: state.tipoFiltro,
      paginaActual: state.paginaActual,
      totalPaginas: state.totalPaginas,
      setPaginaActual: state.setPaginaActual,
    }))
  );

  useEffect(() => {
    getEventosActivosService();
  }, [paginaActual]);

  // Create a map of eventoId to estatus
  const suscripcionesMap = useMemo(() => {
    const map = new Map<number, EstatusPagoEvento>();
    suscripcionesEventoUsuario.forEach(s => {
      map.set(s.eventoId, s.estatus);
    });
    return map;
  }, [suscripcionesEventoUsuario]);

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
            suscripcionesMap={suscripcionesMap}
          />
        )}

        {filteredEventos.length > 0 && totalPaginas > 1 && (
          <EventosPagination
            currentPage={paginaActual}
            totalPages={totalPaginas}
            setCurrentPage={setPaginaActual}
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
