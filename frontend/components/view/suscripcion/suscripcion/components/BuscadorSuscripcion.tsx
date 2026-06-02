"use client";

import React, { useCallback, useEffect, useRef } from "react";
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

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Ref para siempre tener el estatusFiltro actualizado dentro del timeout
  const estatusFiltroRef = useRef(estatusFiltro);
  useEffect(() => {
    estatusFiltroRef.current = estatusFiltro;
  }, [estatusFiltro]);

  const handleFiltroChange = useCallback(
    (value: string) => {
      setFiltro(value);
      setPaginaActual(1);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // ✅ Se pasa `value` directo (no del store) y el estatus desde la ref
      timeoutRef.current = setTimeout(() => {
        getSuscripcionesService({
          filtro: value,
          estatus: estatusFiltroRef.current,
        });
      }, 600);
    },
    [setFiltro, setPaginaActual]
  );

  const handleEstatusChange = useCallback(
    (value: string) => {
      const estatus =
        value === "todos" ? "todos" : (value as EstatusSuscripcion);
      setEstatusFiltro(estatus);
      setPaginaActual(1);

      // ✅ Se pasa `filtro` del store (no cambia con keystrokes aquí)
      //    y el nuevo estatus directo (no del store, aún no actualizado)
      getSuscripcionesService({ filtro, estatus });
    },
    [setEstatusFiltro, setPaginaActual, filtro]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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
          value={estatusFiltro}
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