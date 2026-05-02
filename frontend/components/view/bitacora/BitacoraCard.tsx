'use client';

import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { BitacoraEntry } from "./store/bitacoraStore";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hash } from "lucide-react";
import { CalendarDays } from "lucide-react";

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
      
    return format(date, "d MMM. yyyy, h:mm a", {
      locale: es,
    }).replace('PM', 'p. m.').replace('AM', 'a. m.');
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
  const formattedDateTime = formatDate(entry.fecha);

  return (
    <Card className="w-full">
      <CardContent className="pt-4 pb-4 flex flex-col gap-3">
        {/* Top row: badges + ID + actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              cambio de estado
            </Badge>
            <Badge variant="secondary" className="text-xs uppercase">
              {entry.type.replace(/_/g, " ")}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <Hash className="h-3 w-3" />
              {entry.id}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onViewDetails(entry)}
              title="Ver detalles"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Mensaje */}
        <p className="text-sm text-foreground leading-relaxed line-clamp-2">
          {entry.mensaje}
        </p>

        {/* Footer: email + fecha */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-1 border-t">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            {entry.usuario.email}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {formattedDateTime}
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
    <div className="flex flex-col gap-5">
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
