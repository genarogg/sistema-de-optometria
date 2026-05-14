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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download } from "lucide-react";
import { EstatusSuscripcion, Rol } from "@/global/enums";
import { updateEstatusSuscripcionService } from "../service/updateEstatusSuscripcion.service";
import WhatsappButton  from "@/components/ux/btn/whatsapp";
import Pagination from "./Pagination";
import type { Suscripcion } from "../store/suscripcionStore";

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

const estatusColorMap: Record<EstatusSuscripcion, string> = {
  [EstatusSuscripcion.PENDIENTE]: "bg-yellow-100 text-yellow-800",
  [EstatusSuscripcion.VALIDADO]: "bg-green-100 text-green-800",
  [EstatusSuscripcion.RECHAZADA]: "bg-red-100 text-red-800",
  [EstatusSuscripcion.VENCIDO]: "bg-gray-100 text-gray-800",
};

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

    const formatearFecha = useCallback((fecha: string) => {
      return new Date(fecha).toLocaleDateString("es-ES", {
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
                <TableHead className="text-sm font-semibold border-r">Estatus</TableHead>
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
                    className={`transition-colors hover:bg-primary/20 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/80"
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
                      ${suscripcion.planSuscripcion.costo}
                    </TableCell>
                    <TableCell className="text-sm capitalize border-r">
                      {suscripcion.planSuscripcion.tipo}
                    </TableCell>
                    <TableCell className="border-r">
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
                        <Badge className={estatusColorMap[suscripcion.estatus]}>
                          {suscripcion.estatus}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="flex items-center justify-center gap-1">
                      {/* Botón Ver detalles */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setSuscripcionDetalleId(suscripcion.id)}
                        title="Ver detalles"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>

                      {/* Botón WhatsApp - solo admin */}
                      {esAdminOSuperUsuario && (
                        <WhatsappButton
                          phoneNumber={suscripcion.usuario.cedula}
                         
                        />
                      )}

                      {/* Botón Ver comprobante */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => {
                          // Aqui van acciones para ver comprobante
                        }}
                        title="Ver comprobante"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>

                      {/* Botón Descargar carnet - solo VALIDADO */}
                      {suscripcion.estatus === EstatusSuscripcion.VALIDADO && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          title="Descargar carnet"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      )}

                      {/* Botón Descargar solvencia - solo VALIDADO */}
                      {suscripcion.estatus === EstatusSuscripcion.VALIDADO && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          title="Descargar solvencia"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      )}

                      {/* Botón Descargar recibo - solo PENDIENTE */}
                      {suscripcion.estatus === EstatusSuscripcion.PENDIENTE && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          title="Descargar recibo"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      )}
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
      </>
    );
  }
);

TablaSuscripcion.displayName = "TablaSuscripcion";

export default TablaSuscripcion;
