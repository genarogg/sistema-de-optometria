"use client";

import React, { useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { EstatusSuscripcion, Rol } from "@/global/enums";
import Pagination from "./Pagination";
import { updateEstatusSuscripcionService } from "../service/updateEstatusSuscripcion.service";
import WhatsAppButton from "@/components/ux/btn/whatsapp";
import type { Suscripcion } from "../store/suscripcionStore";

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

const estatusColorMap: Record<EstatusSuscripcion, string> = {
  [EstatusSuscripcion.PENDIENTE]: "bg-yellow-100 text-yellow-800",
  [EstatusSuscripcion.VALIDADO]: "bg-green-100 text-green-800",
  [EstatusSuscripcion.RECHAZADA]: "bg-red-100 text-red-800",
  [EstatusSuscripcion.VENCIDO]: "bg-gray-100 text-gray-800",
};

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

    const formatearFecha = useCallback((fecha: string) => {
      return new Date(fecha).toLocaleDateString("es-ES", {
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
                    <Badge className={estatusColorMap[suscripcion.estatus]}>
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
                        Comprobante
                      </p>
                      <p>{suscripcion.comprobante}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Costo
                      </p>
                      <p>${suscripcion.planSuscripcion.costo}</p>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs flex-1"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Detalles
                    </Button>

                    {esAdminOSuperUsuario && (
                      <WhatsAppButton
                        phoneNumber={suscripcion.usuario.telefono}
                      />
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs flex-1"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Comprobante
                    </Button>

                    {suscripcion.estatus === EstatusSuscripcion.VALIDADO && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs flex-1"
                        >
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Carnet
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs flex-1"
                        >
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Solvencia
                        </Button>
                      </>
                    )}

                    {suscripcion.estatus === EstatusSuscripcion.PENDIENTE && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs flex-1"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Recibo
                      </Button>
                    )}
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
      </>
    );
  }
);

TarjetaSuscripcion.displayName = "TarjetaSuscripcion";

export default TarjetaSuscripcion;
