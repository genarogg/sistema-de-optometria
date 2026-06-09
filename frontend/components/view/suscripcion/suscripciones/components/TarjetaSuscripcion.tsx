"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EstatusSuscripcion, Rol } from "@/global/enums";
import Pagination from "./Pagination";
import ImageModal from "./ImageModal";
import AccionesSuscripcion from "./AccionesSuscripcion";
import SuscripcionDetailsModal from "./modalDetails/SuscripcionDetailsModal";
import { updateEstatusSuscripcionService } from "../service/updateEstatusSuscripcion.service";
import type { Suscripcion } from "../store/suscripcionStore";
import getStatusColor from "../utils/getStatusColor";
import { showMoney } from "supermoney";

interface TarjetaSuscripcionProps {
  suscripciones: Suscripcion[];
  rolActual: Rol;
  paginaActual: number;
  totalPaginas: number;
  itemsPorPagina?: number;
  onPaginaChange: (pagina: number) => void;
  cargando?: boolean;
  meta?: any;
}



const TarjetaSuscripcion: React.FC<TarjetaSuscripcionProps> = React.memo(
  ({
    suscripciones,
    rolActual,
    paginaActual,
    totalPaginas,
    itemsPorPagina = 10,
    onPaginaChange,
    cargando = false,
    meta,
  }) => {
    const [comprobanteImage, setComprobanteImage] = useState<string | null>(null);
    const [suscripcionDetalleId, setSuscripcionDetalleId] = useState<number | null>(null);
    const esAdminOSuperUsuario =
      rolActual === Rol.ADMINISTRADOR || rolActual === Rol.SUPER_USUARIO;

    const suscripcionesPaginadas = useMemo(() => {
      const inicio = (paginaActual - 1) * itemsPorPagina;
      return suscripciones.slice(inicio, inicio + itemsPorPagina);
    }, [suscripciones, paginaActual, itemsPorPagina]);

    const handleEstatusChange = useCallback(
      (suscripcionId: number, nuevoEstatus: string) => {
        updateEstatusSuscripcionService({
          suscripcionId,
          nuevoEstatus: nuevoEstatus as EstatusSuscripcion,
        });
      },
      []
    );

    const formatearFecha = useCallback((fecha: string | number) => {
      if (!fecha) return "";
      const timestamp = typeof fecha === "string" ? parseInt(fecha, 10) : fecha;
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return String(fecha);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }, []);

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
                    <div className={getStatusColor(suscripcion.estatus)}>
                      {suscripcion.estatus}
                    </div>
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
                        Comprobante
                      </p>
                      <p>{suscripcion.comprobante}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Costo
                      </p>
                      <p>{suscripcion.planSuscripcion.costo === 0 ? "sin costo" : `$ ${showMoney(suscripcion.planSuscripcion.costo)}`}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Tipo Plan
                      </p>
                      <p className="capitalize">
                        {suscripcion.planSuscripcion.tipo}
                      </p>
                    </div>
                  </div>

                  {/* Selector de estatus - solo admin */}
                  {esAdminOSuperUsuario && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        Cambiar Estatus
                      </p>
                      <Select
                        defaultValue={suscripcion.estatus}
                        onValueChange={(value) =>
                          handleEstatusChange(suscripcion.id, value)
                        }
                      >
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(EstatusSuscripcion).map((estatus) => (
                            <SelectItem key={estatus} value={estatus}>
                              {estatus}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="pt-2 border-t flex flex-wrap gap-2">
                    <AccionesSuscripcion
                      suscripcion={suscripcion}
                      rolActual={rolActual}
                      onVerDetalles={setSuscripcionDetalleId}
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
        {suscripcionDetalleId && (
          <SuscripcionDetailsModal
            suscripcion={suscripciones.find(s => s.id === suscripcionDetalleId)}
            onClose={() => setSuscripcionDetalleId(null)}
          />
        )}
      </>
    );
  }
);

TarjetaSuscripcion.displayName = "TarjetaSuscripcion";

export default TarjetaSuscripcion;
