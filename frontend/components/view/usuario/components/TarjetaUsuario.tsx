"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Rol } from "@/global/enums";
import ModalEditarUsuario from "./ModalEditarUsuario";
import ModalCambiarPassword from "./ModalCambiarPassword";
import type { Usuario } from "../store/usuariosStore";
import AccionesUsuario from "./AccionesUsuario";

interface TarjetaUsuarioProps {
  usuarios: Usuario[];
  rolActual: Rol;
  paginaActual: number;
  itemsPorPagina: number;
  onPaginaChange: (pagina: number) => void;
}

const TarjetaUsuario: React.FC<TarjetaUsuarioProps> = React.memo(
  ({ usuarios, rolActual, paginaActual, itemsPorPagina, onPaginaChange }) => {
    const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
    const [usuarioPassword, setUsuarioPassword] = useState<Usuario | null>(null);

    const usuariosPaginados = useMemo(() => {
      const inicio = (paginaActual - 1) * itemsPorPagina;
      return usuarios.slice(inicio, inicio + itemsPorPagina);
    }, [usuarios, paginaActual, itemsPorPagina]);

    const totalPaginas = useMemo(
      () => Math.max(1, Math.ceil(usuarios.length / itemsPorPagina)),
      [usuarios.length, itemsPorPagina]
    );

    const handleAbrirEditar = useCallback((usuario: Usuario) => {
      setUsuarioEditar(usuario);
    }, []);

    const handleAbrirPassword = useCallback((usuario: Usuario) => {
      setUsuarioPassword(usuario);
    }, []);

    const handleCerrarEditar = useCallback(() => setUsuarioEditar(null), []);
    const handleCerrarPassword = useCallback(() => setUsuarioPassword(null), []);

    return (
      <>
        <div className="flex flex-col gap-3">
          {usuariosPaginados.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground text-sm">
              No se encontraron usuarios.
            </p>
          ) : (
            usuariosPaginados.map((usuario) => (
              <Card key={usuario.id} className="shadow-sm gap-0">
                <CardHeader className="py-2 px-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="tracking-tight text-base font-medium capitalize">
                        {usuario.primerNombre} {usuario.primerApellido}
                      </CardTitle>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {usuario.rol}
                      </div>
                    </div>
                    <AccionesUsuario
                      usuario={usuario}
                      onEditar={handleAbrirEditar}
                      onPassword={handleAbrirPassword}
                    />
                  </div>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <div className="flex flex-col gap-2 text-sm">
                    <div>
                      <span className="font-medium">ID:</span> {usuario.id}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {usuario.email}
                    </div>
                    {usuario.telefono && (
                      <div>
                        <span className="font-medium">Teléfono:</span> {usuario.telefono}
                      </div>
                    )}
                    {usuario.cedula && (
                      <div>
                        <span className="font-medium">Cédula:</span> {usuario.cedula}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Paginacion */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">
              {paginaActual} / {totalPaginas} &mdash; {usuarios.length} usuarios
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPaginaChange(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPaginaChange(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Modales */}
        {usuarioEditar && (
          <ModalEditarUsuario
            usuario={usuarioEditar}
            rolActual={rolActual}
            open={!!usuarioEditar}
            onClose={handleCerrarEditar}
          />
        )}
        {usuarioPassword && (
          <ModalCambiarPassword
            usuario={usuarioPassword}
            open={!!usuarioPassword}
            onClose={handleCerrarPassword}
          />
        )}
      </>
    );
  }
);

TarjetaUsuario.displayName = "TarjetaUsuario";

export default TarjetaUsuario;
