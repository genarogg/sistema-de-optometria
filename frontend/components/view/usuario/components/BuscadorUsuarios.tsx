"use client";

import React, { useCallback, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import useUsuariosStore from "../store/usuariosStore";
import { getUsuariosService } from "../service/getUsuarios.service";

const BuscadorUsuarios: React.FC = React.memo(() => {
  const filtro = useUsuariosStore((s) => s.filtro);
  const setFiltro = useUsuariosStore((s) => s.setFiltro);
  const setPaginaActual = useUsuariosStore((s) => s.setPaginaActual);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const valor = e.target.value;
      setFiltro(valor);
      setPaginaActual(1);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        getUsuariosService({ filtro: valor });
      }, 1500);
    },
    [setFiltro, setPaginaActual]
  );

  return (
    <div className="relative w-full min-md:max-w-[320px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        className="pl-9"
        placeholder="Buscar por nombre, email o cedula..."
        value={filtro}
        onChange={handleChange}
      />
    </div>
  );
});

BuscadorUsuarios.displayName = "BuscadorUsuarios";

export default BuscadorUsuarios;
