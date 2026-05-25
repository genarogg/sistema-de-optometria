"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Rol, EstatusPagoEvento } from "@/global/enums";
import Pagination from "./Pagination";
import ImageModal from "./ImageModal";
import AccionesSuscripcionEvento from "./AccionesSuscripcionEvento";
import SuscripcionEventoDetailsModal from "./SuscripcionEventoDetailsModal";
import type { SuscripcionEvento } from "../store/suscripcionEventoStore";
import { updateEstatusSuscripcionEventoService } from "../service/updateEstatusSuscripcionEvento.service";

export interface SuscripcionEventoMeta {
  total: number;
  page: number;
  limit: number;
}

interface TablaSuscripcionEventoProps {
  suscripciones: SuscripcionEvento[];
  rolActual: Rol;
  paginaActual: number;
  totalPaginas: number;
  meta?: SuscripcionEventoMeta;
  onPaginaChange: (pagina: number) => void;
  cargando?: boolean;
}

const TablaSuscripcionEvento: React.FC<TablaSuscripcionEventoProps> = React.memo(
  ({
    suscripciones,
    rolActual,
    paginaActual,
    totalPaginas,
    meta,
    onPaginaChange,
    cargando = false,
  }) => {
    const [suscripcionDetalle, setSuscripcionDetalle] = useState<SuscripcionEvento | null>(null);
    const [comprobanteImage, setComprobanteImage] = useState<string | null>(null);

    const esAdminOSuperUsuario =
      rolActual === Rol.ADMINISTRADOR || rolActual === Rol.SUPER_USUARIO;

    const itemsPorPagina = meta?.limit || 20;
    const suscripcionesPaginadas = useMemo(() => {
      const inicio = (paginaActual - 1) * itemsPorPagina;
      return suscripciones.slice(inicio, inicio + itemsPorPagina);
    }, [suscripciones, paginaActual, itemsPorPagina]);

    const handleEstatusChange = useCallback(
      (suscripcionId: number, nuevoEstatus: string) => {
        updateEstatusSuscripcionEventoService({
          suscripcionEventoId: suscripcionId,
          estatus: nuevoEstatus as EstatusPagoEvento,
        });
      },
      []
    );

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
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="w-[80px] text-sm font-semibold border-r">ID</TableHead>
                <TableHead className="text-sm font-semibold border-r">CI</TableHead>
                <TableHead className="text-sm font-semibold border-r">Fecha</TableHead>
                <TableHead className="text-sm font-semibold border-r">Evento</TableHead>
                <TableHead className="text-sm font-semibold border-r">Precio</TableHead>
                <TableHead className="text-sm font-semibold border-r text-center">Estatus</TableHead>
                <TableHead className="text-sm font-semibold text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suscripcionesPaginadas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No se encontraron suscripciones.
                  </TableCell>
                </TableRow>
              ) : (
                suscripcionesPaginadas.map((suscripcion, index) => (
                  <TableRow
                    key={suscripcion.id}
                    className={`transition-colors hover:bg-primary/10 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/90"
                    }`}
                  >
                    <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-[80px] border-r">
                      {suscripcion.id}
                    </TableCell>
                    <TableCell className="font-medium border-r">
                      {suscripcion.usuario.cedula}
                    </TableCell>
                    <TableCell className="text-sm border-r">
                      {formatearFecha(suscripcion.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm border-r">
                      {suscripcion.evento.nombre}
                    </TableCell>
                    <TableCell className="text-sm border-r">
                      $ {suscripcion.precioAlSuscripcion}
                    </TableCell>
                    <TableCell className="border-r">
                      <div className="flex items-center justify-center w-full h-full">
                        <Badge variant={
                          suscripcion.estatus === "PENDIENTE" ? "default" :
                          suscripcion.estatus === "PAGADO" ? "default" : "destructive"
                        }>
                          {suscripcion.estatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <AccionesSuscripcionEvento
                        suscripcion={suscripcion}
                        rolActual={rolActual}
                        onVerDetalles={setSuscripcionDetalle}
                        onVerComprobante={setComprobanteImage}
                        onEstatusChange={handleEstatusChange}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onPaginaChange={onPaginaChange}
          cargando={cargando}
          totalItems={meta?.total}
          itemsPorPagina={itemsPorPagina}
          showPageNumbers
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

TablaSuscripcionEvento.displayName = "TablaSuscripcionEvento";

export default TablaSuscripcionEvento;
