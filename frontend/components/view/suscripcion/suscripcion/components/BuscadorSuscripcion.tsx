"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import useSuscripcionStore from "../store/suscripcionStore";
import { EstatusSuscripcion } from "@/global/enums";
import { getSuscripcionesService } from "../service/getSuscripciones.service";

const BuscadorSuscripcion: React.FC = () => {
  const filtro = useSuscripcionStore((s) => s.filtro);
  const estatusFiltro = useSuscripcionStore((s) => s.estatusFiltro);
  const setFiltro = useSuscripcionStore((s) => s.setFiltro);
  const setEstatusFiltro = useSuscripcionStore((s) => s.setEstatusFiltro);
  const setPaginaActual = useSuscripcionStore((s) => s.setPaginaActual);

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleFiltroChange = useCallback(
    (value: string) => {
      setFiltro(value);
      setPaginaActual(1);

      // Limpiar timeout anterior
      if (timeoutId) clearTimeout(timeoutId);

      // Establecer nuevo timeout de 600ms
      const newTimeoutId = setTimeout(() => {
        getSuscripcionesService({ filtro: value });
      }, 600);

      setTimeoutId(newTimeoutId);
    },
    [setFiltro, setPaginaActual, timeoutId]
  );

  const handleEstatusChange = useCallback(
    (value: string) => {
      const estatus =
        value === "todos" ? null : (value as EstatusSuscripcion);
      setEstatusFiltro(estatus);
      setPaginaActual(1);
      getSuscripcionesService({ filtro });
    },
    [setEstatusFiltro, setPaginaActual, filtro]
  );

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="w-full md:max-w-[320px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por CI, nombre, comprobante..."
            value={filtro}
            onChange={(e) => handleFiltroChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={estatusFiltro || "todos"}
          onValueChange={handleEstatusChange}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {Object.values(EstatusSuscripcion).map((estatus) => (
              <SelectItem key={estatus} value={estatus}>
                {estatus}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BuscadorSuscripcion;
