"use client";

import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import useSuscripcionStore from "../store/suscripcionStore";
import { getSuscripcionesService } from "../service/getSuscripciones.service";
import { Rol, EstatusSuscripcion } from "@/global/enums";
import BuscadorSuscripcion from "./BuscadorSuscripcion";
import TablaSuscripcion from "./TablaSuscripcion";
import TarjetaSuscripcion from "./TarjetaSuscripcion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/context/auth/AuthContext";
import notify from "@/components/nano/notify";

interface SuscripcionSectionProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const SuscripcionSection: React.FC<SuscripcionSectionProps> = ({ setActiveTab, activeTab }) => {
  const suscripciones = useSuscripcionStore((s) => s.suscripciones);
  const cargando = useSuscripcionStore((s) => s.cargando);
  const error = useSuscripcionStore((s) => s.error);
  const paginaActual = useSuscripcionStore((s) => s.paginaActual);
  const meta = useSuscripcionStore((s) => s.meta);
  const filtro = useSuscripcionStore((s) => s.filtro);
  const estatusFiltro = useSuscripcionStore((s) => s.estatusFiltro);
  const initializeEstatusFiltro = useSuscripcionStore((s) => s.initializeEstatusFiltro);
  const setPaginaActual = useSuscripcionStore((s) => s.setPaginaActual);
  const getTotalPaginas = useSuscripcionStore((s) => s.getTotalPaginas);

  const { usuario } = useAuthStore();
  
  // Inicializar el filtro de estatus según el rol cuando el usuario esté disponible
  useEffect(() => {
    if (usuario) {
      initializeEstatusFiltro(usuario.rol);
    }
  }, [usuario, initializeEstatusFiltro]);
  const isMobile = useIsMobile();

  // Refs para evitar notificaciones duplicadas
  const notificacionMostradaRef = useRef<string | null>(null);

  // Mostrar opciones solo si es admin o super usuario
  const esAdminOSuperUsuario =
    usuario?.rol === Rol.ADMINISTRADOR || usuario?.rol === Rol.SUPER_USUARIO;

  // Validar suscripciones y redirigir
  useEffect(() => {
    // ✅ Esperar a que la carga termine Y que suscripciones sea un array definido
    if (!esAdminOSuperUsuario && !cargando && suscripciones !== undefined && suscripciones !== null) {

      if (suscripciones.length === 0) {
        setActiveTab('suscribirme');

        if (notificacionMostradaRef.current !== 'ninguna') {
          notificacionMostradaRef.current = 'ninguna';
          notify({
            type: 'warning',
            message: 'No tienes ninguna suscripción activa. Por favor, suscribete para acceder a las funciones del sistema.'
          });
        }
        return; // ✅ Salir para no ejecutar el bloque siguiente
      }

      // suscripciones.length > 0
      const tieneSuscripcionValida = suscripciones.some(
        (s) => s.estatus === EstatusSuscripcion.PENDIENTE || s.estatus === EstatusSuscripcion.VALIDADO
      );

      const suscripcionVencida = suscripciones.find(
        (s) => s.estatus === EstatusSuscripcion.VENCIDO
      );

      const suscripcionRechazada = suscripciones.find(
        (s) => s.estatus === EstatusSuscripcion.RECHAZADA
      );

      if (!tieneSuscripcionValida) {
        setActiveTab('suscribirme');

        let tipoNotificacion: string;
        if (suscripcionVencida) {
          tipoNotificacion = 'vencida';
        } else if (suscripcionRechazada) {
          tipoNotificacion = 'rechazada';
        } else {
          return;
        }

        if (notificacionMostradaRef.current !== tipoNotificacion) {
          notificacionMostradaRef.current = tipoNotificacion;
          if (suscripcionVencida) {
            notify({
              type: 'warning',
              message: 'Tu plan de suscripción está vencido. Por favor renueva tu suscripción.'
            });
          } else if (suscripcionRechazada) {
            notify({
              type: 'error',
              message: 'Tu plan de suscripción fue rechazado. Por favor renueva tu suscripción.'
            });
          }
        }
      } else {
        notificacionMostradaRef.current = null;
      }
    }
  }, [esAdminOSuperUsuario, cargando, suscripciones, setActiveTab, activeTab]);

  useEffect(() => {
    getSuscripcionesService({ filtro, pagina: paginaActual, estatus: estatusFiltro });
  }, [filtro, paginaActual, estatusFiltro]);

  const handlePaginaChange = useCallback(
    (pagina: number) => {
      if (pagina >= 1 && pagina <= getTotalPaginas()) {
        setPaginaActual(pagina);
      }
    },
    [setPaginaActual, getTotalPaginas]
  );

  const totalPaginas = getTotalPaginas();

  const suscripcionesSafe = suscripciones ?? [];

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
        ) : suscripcionesSafe.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No se encontraron suscripciones
            </p>
          </div>
        ) : isMobile ? (
          <TarjetaSuscripcion
            suscripciones={suscripcionesSafe}
            rolActual={usuario?.rol || Rol.VISITANTE}
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            meta={meta || undefined}
            onPaginaChange={handlePaginaChange}
            cargando={cargando}
          />
        ) : (
          <TablaSuscripcion
            suscripciones={suscripcionesSafe}
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
