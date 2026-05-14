"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="w-full shadow-sm max-w-[1200] m-auto">
      <CardHeader className="border-b" style={{ paddingBottom: "0px" }}>
        <div className="flex items-center gap-2 text-primary">
          <FileText className="h-5 w-5" />
          <CardTitle className="text-xl">Suscripciones</CardTitle>
          {!cargando && meta && (
            <span className="text-sm font-normal">
              ({meta.total})
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-4">
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
      </CardContent>
    </Card>
  );
};

export default SuscripcionSection;
