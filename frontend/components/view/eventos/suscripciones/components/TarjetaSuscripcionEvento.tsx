"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rol } from "@/global/enums";
import Pagination from "./Pagination";
import ImageModal from "./ImageModal";
import AccionesSuscripcionEvento from "./AccionesSuscripcionEvento";
import SuscripcionEventoDetailsModal from "./SuscripcionEventoDetailsModal";
import type { SuscripcionEvento } from "../store/suscripcionEventoStore";
import getStatusColor from "../utils/getStatusColor";

interface TarjetaSuscripcionEventoProps {
  suscripciones: SuscripcionEvento[];
  rolActual: Rol;
  paginaActual: number;
  totalPaginas: number;
  itemsPorPagina?: number;
  onPaginaChange: (pagina: number) => void;
  cargando?: boolean;
  meta?: any;
}

const TarjetaSuscripcionEvento: React.FC<TarjetaSuscripcionEventoProps> = React.memo(
  ({
    suscripciones,
    rolActual,
    paginaActual,
    totalPaginas,
    itemsPorPagina = 20,
    onPaginaChange,
    cargando = false,
    meta,
  }) => {
    const [comprobanteImage, setComprobanteImage] = useState<string | null>(null);
    const [suscripcionDetalle, setSuscripcionDetalle] = useState<SuscripcionEvento | null>(null);
    const esAdminOSuperUsuario =
      rolActual === Rol.ADMINISTRADOR || rolActual === Rol.SUPER_USUARIO;

    const suscripcionesPaginadas = useMemo(() => {
      const inicio = (paginaActual - 1) * itemsPorPagina;
      return suscripciones.slice(inicio, inicio + itemsPorPagina);
    }, [suscripciones, paginaActual, itemsPorPagina]);

    const formatearFecha = (fecha: string | number) => {
      if (!fecha) return "";
      const timestamp = typeof fecha === "string" ? parseInt(fecha, 10) : fecha;
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return String(fecha);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    };

    return (
      <>
        <div className="space-y-4">
          {suscripcionesPaginadas.length === 0 ? (
            <Card>
              <CardContent className="text-center py-10">
                <p className="text-muted-foreground">
                  No se encontraron suscripciones.
                </p>
              </CardContent>
            </Card>
          ) : (
            suscripcionesPaginadas.map((suscripcion) => (
              <Card key={suscripcion.id} className="overflow-hidden">
                <CardHeader className="pb-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        {suscripcion.usuario.primerNombre}{" "}
                        {suscripcion.usuario.primerApellido}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        CI: {suscripcion.usuario.cedula}
                      </p>
                    </div>
                    <Badge variant={
                      suscripcion.estatus === "PENDIENTE" ? "default" :
                      suscripcion.estatus === "PAGADO" ? "default" : "destructive"
                    }>
                      {suscripcion.estatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Fecha
                      </p>
                      <p>{formatearFecha(suscripcion.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Evento
                      </p>
                      <p className="truncate">{suscripcion.evento.nombre}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Precio
                      </p>
                      <p>$ {suscripcion.precioAlSuscripcion}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Tipo
                      </p>
                      <p className="capitalize">{suscripcion.evento.tipo}</p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="pt-2 border-t flex flex-wrap gap-2">
                    <AccionesSuscripcionEvento
                      suscripcion={suscripcion}
                      rolActual={rolActual}
                      onVerDetalles={setSuscripcionDetalle}
                      onVerComprobante={setComprobanteImage}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Pagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onPaginaChange={onPaginaChange}
          cargando={cargando}
          totalItems={meta?.total}
          itemsPorPagina={itemsPorPagina}
          className="pt-4"
        />

        {comprobanteImage && (
          <ImageModal
            open={true}
            imageUrl={comprobanteImage}
            onClose={() => setComprobanteImage(null)}
          />
        )}
        {suscripcionDetalle && (
          <SuscripcionEventoDetailsModal
            suscripcion={suscripcionDetalle}
            onClose={() => setSuscripcionDetalle(null)}
          />
        )}
      </>
    );
  }
);

TarjetaSuscripcionEvento.displayName = "TarjetaSuscripcionEvento";

export default TarjetaSuscripcionEvento;
