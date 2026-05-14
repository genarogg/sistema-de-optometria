'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  paginaActual: number;
  totalPaginas: number;
  onPaginaChange: (pagina: number) => void;
  cargando?: boolean;
  totalItems?: number;
  itemsPorPagina?: number;
  showPageNumbers?: boolean;
  className?: string;
}

export default function Pagination({
  paginaActual,
  totalPaginas,
  onPaginaChange,
  cargando = false,
  totalItems,
  itemsPorPagina = 10,
  showPageNumbers = false,
  className = '',
}: PaginationProps) {
  if (totalPaginas <= 1) return null;

  const handleAnterior = () => {
    if (paginaActual > 1) {
      onPaginaChange(paginaActual - 1);
    }
  };

  const handleSiguiente = () => {
    if (paginaActual < totalPaginas) {
      onPaginaChange(paginaActual + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPaginas <= 5) {
      for (let i = 1; i <= totalPaginas; i++) {
        pages.push(i);
      }
    } else if (paginaActual <= 3) {
      pages.push(1, 2, 3, 4, 5);
    } else if (paginaActual >= totalPaginas - 2) {
      for (let i = totalPaginas - 4; i <= totalPaginas; i++) {
        pages.push(i);
      }
    } else {
      for (let i = paginaActual - 2; i <= paginaActual + 2; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 ${className}`}>
      {/* Info */}
      {(totalItems !== undefined || showPageNumbers) && (
        <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          <span className="font-medium">
            Página {paginaActual} de {totalPaginas}
          </span>
          {totalItems !== undefined && (
            <>
              <span className="mx-2">•</span>
              <span>
                {(paginaActual - 1) * itemsPorPagina + 1}-
                {Math.min(paginaActual * itemsPorPagina, totalItems)} de{' '}
                <span className="font-medium">{totalItems}</span> resultados
              </span>
            </>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleAnterior}
          disabled={paginaActual === 1 || cargando}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === paginaActual ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0 text-xs"
                onClick={() => onPaginaChange(pageNum)}
                disabled={cargando}
              >
                {pageNum}
              </Button>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleSiguiente}
          disabled={paginaActual === totalPaginas || cargando}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
