'use client';

import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { BitacoraEntry } from "./store/bitacoraStore";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, Mail, Hash, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BitacoraCardListProps {
  entries: BitacoraEntry[];
  loading: boolean;
  onViewDetails: (entry: BitacoraEntry) => void;
}

const formatDate = (dateString: string) => {
  try {
    const date = isNaN(Number(dateString))
      ? new Date(dateString)
      : new Date(Number(dateString));
    return format(date, "d MMM. yyyy, h:mm a", { locale: es })
      .replace('PM', 'p. m.')
      .replace('AM', 'a. m.');
  } catch {
    return dateString;
  }
};

const SingleBitacoraCard = memo(function SingleBitacoraCard({
  entry,
  onViewDetails,
}: {
  entry: BitacoraEntry;
  onViewDetails: (entry: BitacoraEntry) => void;
}) {
  return (
    <Card className="w-full overflow-hidden max-w-[90vw]">
      <CardContent className="p-3 flex flex-col gap-3 ">

        {/* Top row: badges + ID + botón */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between min-w-0">
          {/* Badges — pueden hacer wrap sin romper el layout */}
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <Badge variant="outline" className="text-xs shrink-0">
              cambio de estado
            </Badge>
            <Badge variant="secondary" className="text-xs uppercase shrink-0">
              {entry.type.replace(/_/g, " ")}
            </Badge>
          </div>

          {/* ID + botón — no hacen wrap, el ID trunca si no cabe */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono truncate max-w-[120px]">
              <Hash className="h-3 w-3 shrink-0" />
              {entry.id}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 shrink-0"
              onClick={() => onViewDetails(entry)}
              title="Ver detalles"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Mensaje */}
        <p className="text-sm text-foreground leading-relaxed line-clamp-2 break-words">
          {entry.mensaje}
        </p>

        {/* Footer: email + fecha */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-1 border-t min-w-0">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{entry.usuario.email}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            {formatDate(entry.fecha)}
          </span>
        </div>

      </CardContent>
    </Card>
  );
});

const BitacoraCardList = memo(function BitacoraCardList({
  entries,
  loading,
  onViewDetails,
}: BitacoraCardListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={`skeleton-${i}`} className="border-gray-200 rounded-2xl">
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-8 w-40 rounded-2xl" />
                <Skeleton className="h-8 w-56 rounded-2xl" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-9 rounded-xl" />
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="border-t pt-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500 text-sm bg-white rounded-2xl border border-dashed border-gray-300">
        No se encontraron registros de bitácora
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 items-center">
      {entries.map((entry) => (
        <SingleBitacoraCard
          key={entry.id}
          entry={entry}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
});

export default BitacoraCardList;