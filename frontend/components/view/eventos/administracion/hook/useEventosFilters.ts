import React, { useMemo } from 'react';

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

export function useEventosFilters(eventos: Evento[]) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [vigenciaFilter, setVigenciaFilter] = React.useState<string | null>(null);
  const [tipoFilter, setTipoFilter] = React.useState<string | null>(null);

  const filteredEventos = useMemo(() => {
    return eventos.filter((evento) => {
      const matchesSearch =
        evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evento.lugar.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVigencia = !vigenciaFilter || evento.vigencia === vigenciaFilter;
      const matchesTipo = !tipoFilter || evento.tipo === tipoFilter;

      return matchesSearch && matchesVigencia && matchesTipo;
    });
  }, [eventos, searchTerm, vigenciaFilter, tipoFilter]);

  return {
    filteredEventos,
    searchTerm,
    setSearchTerm,
    vigenciaFilter,
    setVigenciaFilter,
    tipoFilter,
    setTipoFilter,
  };
}
