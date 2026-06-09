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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EstatusSuscripcion, Rol } from "@/global/enums";
import { updateEstatusSuscripcionService } from "../service/updateEstatusSuscripcion.service";

import Pagination from "./Pagination";
import ImageModal from "./ImageModal";
import AccionesSuscripcion from "./AccionesSuscripcion";
import SuscripcionDetailsModal from "./modalDetails/SuscripcionDetailsModal";
import type { Suscripcion } from "../store/suscripcionStore";
import getStatusColor from "../utils/getStatusColor";
import { showMoney } from "supermoney";

export interface SuscripcionMeta {
  total: number;
  page: number;
  limit: number;
}

interface TablaSuscripcionProps {
  suscripciones: Suscripcion[];
  rolActual: Rol;
  paginaActual: number;
  totalPaginas: number;
  meta?: SuscripcionMeta;
  onPaginaChange: (pagina: number) => void;
  cargando?: boolean;
}



const TablaSuscripcion: React.FC<TablaSuscripcionProps> = React.memo(
  ({
    suscripciones,
    rolActual,
    paginaActual,
    totalPaginas,
    meta,
    onPaginaChange,
    cargando = false,
  }) => {
    const [suscripcionDetalleId, setSuscripcionDetalleId] = useState<
      number | null
    >(null);
    const [comprobanteImage, setComprobanteImage] = useState<string | null>(null);

    const esAdminOSuperUsuario =
      rolActual === Rol.ADMINISTRADOR || rolActual === Rol.SUPER_USUARIO;

    const itemsPorPagina = meta?.limit || 10;
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
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="w-[80px] text-sm font-semibold border-r">ID</TableHead>
                <TableHead className="text-sm font-semibold border-r">CI</TableHead>
                <TableHead className="text-sm font-semibold border-r">Fecha</TableHead>
                <TableHead className="text-sm font-semibold border-r">Comprobante</TableHead>
                <TableHead className="text-sm font-semibold border-r">Costo</TableHead>
                <TableHead className="text-sm font-semibold border-r">Tipo de Plan</TableHead>
                <TableHead className="text-sm font-semibold border-r text-center">Estatus</TableHead>
                <TableHead className="text-sm font-semibold text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suscripcionesPaginadas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
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
                      {suscripcion.comprobante}
                    </TableCell>
                    <TableCell className="text-sm border-r">
                      {suscripcion.planSuscripcion.costo === 0 ? "sin costo" : `$ ${showMoney(suscripcion.planSuscripcion.costo)}`}
                    </TableCell>
                    <TableCell className="text-sm capitalize border-r">
                      {suscripcion.planSuscripcion.tipo}
                    </TableCell>
                    <TableCell className="border-r">
                      <div className="flex items-center justify-center w-full h-full">
                        {esAdminOSuperUsuario ? (
                          <Select
                            defaultValue={suscripcion.estatus}
                            onValueChange={(value) =>
                              handleEstatusChange(suscripcion.id, value)
                            }
                          >
                            <SelectTrigger className="w-[140px] h-8 text-xs">
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
                        ) : (
                          <div className={getStatusColor(suscripcion.estatus)}>
                            {suscripcion.estatus}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="flex  gap-1">
                      <AccionesSuscripcion
                        suscripcion={suscripcion}
                        rolActual={rolActual}
                        onVerDetalles={setSuscripcionDetalleId}
                        onVerComprobante={setComprobanteImage}
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

TablaSuscripcion.displayName = "TablaSuscripcion";

export default TablaSuscripcion;
