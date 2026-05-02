'use client';

import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye } from 'lucide-react';
import type { BitacoraEntry } from './store/bitacoraStore';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const formatDate = (dateString: string) => {
  try {
    const date = isNaN(Number(dateString))
      ? new Date(dateString)
      : new Date(Number(dateString));

    return format(date, "d MMM. yyyy, h:mm a", {
      locale: es,
    }).replace('PM', 'p. m.').replace('AM', 'a. m.');
  } catch {
    return dateString;
  }
};

interface BitacoraTableProps {
  entries: BitacoraEntry[];
  loading: boolean;
  onViewDetails: (entry: BitacoraEntry) => void;
}

const SKELETON_ROWS = 5;

const BitacoraTable = memo(function BitacoraTable({
  entries,
  loading,
  onViewDetails,
}: BitacoraTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="w-[80px] text-sm font-semibold">
              ID
            </TableHead>
            <TableHead className="text-sm font-semibold">
              Usuario
            </TableHead>
            <TableHead className="text-sm font-semibold text-center">
              Tipo
            </TableHead>
            <TableHead className="text-sm font-semibold text-right">
              Fecha y Hora
            </TableHead>
            <TableHead className="text-sm font-semibold text-center w-24">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                <TableCell className="px-6 py-4"><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell className="px-6 py-4"><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell className="px-6 py-4 text-center"><Skeleton className="h-6 w-24 mx-auto rounded-full" /></TableCell>
                <TableCell className="px-6 py-4 text-right"><Skeleton className="h-4 w-32 ml-auto" /></TableCell>
                <TableCell className="px-6 py-4 text-center"><Skeleton className="h-8 w-8 mx-auto rounded-md" /></TableCell>
              </TableRow>
            ))
          ) : entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No se encontraron registros de bitácora
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry, index) => {
              const formattedDateTime = formatDate(entry.fecha);
              return (
                <TableRow
                  key={entry.id}
                  className={`h-16 transition-colors hover:bg-[#bedcff] ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/80"
                  }`}
                >
                  <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-[80px]">
                    {entry.id}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {entry.usuario.email}
                  </TableCell>
                  <TableCell className="text-sm text-center">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs">
                      {entry.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground text-right">
                    {formattedDateTime}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onViewDetails(entry)}
                      className="h-8 w-8 bg-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
});

export default BitacoraTable;