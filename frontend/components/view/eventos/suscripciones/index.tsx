"use client";

import React, { useEffect, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import useSuscripcionEventoStore from "./store/suscripcionEventoStore";
import getSuscripcionesEventoService from "./service/getSuscripcionesEvento.service";
import { Rol } from "@/global/enums";
import BuscadorSuscripcionEvento from "./components/BuscadorSuscripcionEvento";
import TablaSuscripcionEvento from "./components/TablaSuscripcionEvento";
import TarjetaSuscripcionEvento from "./components/TarjetaSuscripcionEvento";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/context/auth/AuthContext";

const SuscripcionesEventoSection: React.FC = () => {
  const suscripciones = useSuscripcionEventoStore((s) => s.suscripciones);
  const cargando = useSuscripcionEventoStore((s) => s.cargando);
  const error = useSuscripcionEventoStore((s) => s.error);
  const paginaActual = useSuscripcionEventoStore((s) => s.paginaActual);
  const meta = useSuscripcionEventoStore((s) => s.meta);
  const filtro = useSuscripcionEventoStore((s) => s.filtro);
  const estatusFiltro = useSuscripcionEventoStore((s) => s.estatusFiltro);
  const setPaginaActual = useSuscripcionEventoStore((s) => s.setPaginaActual);
  const getTotalPaginas = useSuscripcionEventoStore((s) => s.getTotalPaginas);

  const { usuario } = useAuthStore();
  const isMobile = useIsMobile();

  const esAdminOSuperUsuario =
    usuario?.rol === Rol.ADMINISTRADOR || usuario?.rol === Rol.SUPER_USUARIO;

  useEffect(() => {
    getSuscripcionesEventoService({ filtro, estatus: estatusFiltro, pagina: paginaActual });
  }, [filtro, estatusFiltro, paginaActual]);

  const handlePaginaChange = useCallback(
    (pagina: number) => {
      if (pagina >= 1 && pagina <= getTotalPaginas()) {
        setPaginaActual(pagina);
      }
    },
    [setPaginaActual, getTotalPaginas]
  );

  const totalPaginas = getTotalPaginas();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="pt-2">
          <BuscadorSuscripcionEvento />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {cargando ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : suscripciones.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No se encontraron suscripciones de eventos
            </p>
          </div>
        ) : isMobile ? (
          <TarjetaSuscripcionEvento
            suscripciones={suscripciones}
            rolActual={usuario?.rol || Rol.VISITANTE}
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            meta={meta || undefined}
            onPaginaChange={handlePaginaChange}
            cargando={cargando}
          />
        ) : (
          <TablaSuscripcionEvento
            suscripciones={suscripciones}
            rolActual={usuario?.rol || Rol.VISITANTE}
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            meta={meta || undefined}
            onPaginaChange={handlePaginaChange}
            cargando={cargando}
          />
        )}
      </div>
    </div>
  );
};

export default SuscripcionesEventoSection;
