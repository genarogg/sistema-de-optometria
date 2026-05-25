'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { TipoEvento, VigenciaEvento } from '@/global/enums';

interface EventosBuscadorProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  vigenciaFilter: string | null;
  onVigenciaChange: (vigencia: string | null) => void;
  tipoFilter: string | null;
  onTipoChange: (tipo: string | null) => void;
  onCreateClick: () => void;
}

export default function EventosBuscador({
  searchTerm,
  onSearchChange,
  vigenciaFilter,
  onVigenciaChange,
  tipoFilter,
  onTipoChange,
  onCreateClick,
}: EventosBuscadorProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col sm:flex-row gap-2 flex-1">
        <Input
          placeholder="Buscar por nombre o lugar..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64"
        />

        <Select
          value={vigenciaFilter || 'all'}
          onValueChange={(value) => onVigenciaChange(value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Vigencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {Object.values(VigenciaEvento).map((vigencia) => (
              <SelectItem key={vigencia} value={vigencia}>
                {vigencia}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={tipoFilter || 'all'}
          onValueChange={(value) => onTipoChange(value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.values(TipoEvento).map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Crear Evento
        </Button>
      </div>
    </div>
  );
}
