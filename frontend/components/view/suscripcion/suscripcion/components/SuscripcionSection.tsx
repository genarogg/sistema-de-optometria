"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText } from "lucide-react";
import useSuscripcionStore from "../store/suscripcionStore";
import { getSuscripcionesService } from "../service/getSuscripciones.service";
import { Rol } from "@/global/enums";
import BuscadorSuscripcion from "./BuscadorSuscripcion";
import TablaSuscripcion from "./TablaSuscripcion";
import TarjetaSuscripcion from "./TarjetaSuscripcion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/context/auth/AuthContext";
import { isProd } from "@/env";

const SuscripcionSection: React.FC = () => {
  const suscripciones = useSuscripcionStore((s) => s.suscripciones);
  const cargando = useSuscripcionStore((s) => s.cargando);
  const error = useSuscripcionStore((s) => s.error);
  const paginaActual = useSuscripcionStore((s) => s.paginaActual);
  const meta = useSuscripcionStore((s) => s.meta);
  const filtro = useSuscripcionStore((s) => s.filtro);
  const setPaginaActual = useSuscripcionStore((s) => s.setPaginaActual);
  const getTotalPaginas = useSuscripcionStore((s) => s.getTotalPaginas);

  const { usuario } = useAuthStore();
  const isMobile = useIsMobile();

  // Mostrar opciones solo si es admin o super usuario
  const esAdminOSuperUsuario =
    usuario?.rol === Rol.ADMINISTRADOR || usuario?.rol === Rol.SUPER_USUARIO;

  useEffect(() => {
    getSuscripcionesService({ filtro, pagina: paginaActual });
  }, [filtro, paginaActual]);

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
          <BuscadorSuscripcion />
        </div>

        {/* Estado de error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Estado de carga */}
        {cargando ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : suscripciones.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No se encontraron suscripciones
            </p>
          </div>
        ) : isMobile ? (
          <TarjetaSuscripcion
            suscripciones={suscripciones}
            rolActual={usuario?.rol || Rol.VISITANTE}
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            meta={meta || undefined}
            onPaginaChange={handlePaginaChange}
            cargando={cargando}
          />
        ) : (
          <TablaSuscripcion
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

export default SuscripcionSection;
