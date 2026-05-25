'use client';

import React, { useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from 'lucide-react';
import EventosBuscador from './components/EventosBuscador';
import TarjetaEvento from './components/TarjetaEvento';
import ModalCrearEvento from './components/ModalCrearEvento';
import { useEventosFilters } from './hook/useEventosFilters';
import { getEventosService } from './service/getEventos.service';
import useEventosStore from './store/eventosStore';
import { useShallow } from 'zustand/react/shallow';

export default function AdministrarEventosSection() {
  const [isEventoModalOpen, setIsEventoModalOpen] = React.useState(false);
  const [selectedEvento, setSelectedEvento] = React.useState<any>(null);

  const { eventos, cargando, error } = useEventosStore(
    useShallow((state) => ({
      eventos: state.eventos,
      cargando: state.cargando,
      error: state.error,
    }))
  );

  const {
    filteredEventos,
    searchTerm,
    setSearchTerm,
    vigenciaFilter,
    setVigenciaFilter,
    tipoFilter,
    setTipoFilter,
  } = useEventosFilters(eventos);

  useEffect(() => {
    getEventosService();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <EventosBuscador
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        vigenciaFilter={vigenciaFilter}
        onVigenciaChange={setVigenciaFilter}
        tipoFilter={tipoFilter}
        onTipoChange={setTipoFilter}
        onCreateClick={() => {
          setSelectedEvento(null);
          setIsEventoModalOpen(true);
        }}
      />

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
              No se encontraron eventos
            </p>
          </div>
        ) : (
          <TarjetaEvento
            eventos={filteredEventos}
            onEdit={(evento) => {
              setSelectedEvento(evento);
              setIsEventoModalOpen(true);
            }}
          />
        )}
      </div>

      <ModalCrearEvento
        isOpen={isEventoModalOpen}
        onClose={() => {
          setIsEventoModalOpen(false);
          setSelectedEvento(null);
        }}
        evento={selectedEvento}
        onSuccess={() => {
          setSelectedEvento(null);
        }}
      />
    </div>
  );
}
