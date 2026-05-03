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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Rol } from "@/global/enums";
import ModalEditarUsuario from "./ModalEditarUsuario";
import ModalCambiarPassword from "./ModalCambiarPassword";
import type { Usuario } from "../store/usuariosStore";
import AccionesUsuario from "./AccionesUsuario";

interface TablaUsuariosProps {
  usuarios: Usuario[];
  rolActual: Rol;
  paginaActual: number;
  itemsPorPagina: number;
  onPaginaChange: (pagina: number) => void;
}

const TablaUsuarios: React.FC<TablaUsuariosProps> = React.memo(
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
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="w-[80px] text-sm font-semibold">ID</TableHead>
                <TableHead className="text-sm font-semibold">Nombre completo</TableHead>
                <TableHead className="text-sm font-semibold">Email</TableHead>
                <TableHead className="text-sm font-semibold">Cedula</TableHead>
                <TableHead className="text-sm font-semibold">Rol</TableHead>
                <TableHead className="text-sm font-semibold text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosPaginados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              ) : (
                usuariosPaginados.map((usuario, index) => (
                  <TableRow
                    key={usuario.id}
                    className={`transition-colors hover:bg-primary/20 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/80"
                    }`}
                  >
                    <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-[80px]">
                      {usuario.id}
                    </TableCell>
                    <TableCell className="font-medium capitalize">
                      {usuario.primerNombre} {usuario.primerApellido}
                    </TableCell>
                    <TableCell className="text-sm ">
                      {usuario.email}
                    </TableCell>
                    <TableCell className="text-sm">{usuario.cedula}</TableCell>
                    <TableCell>
                       <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs">
                           {usuario.rol}
                      </span>
                    </TableCell>
                    <TableCell className="flex items-center justify-center">
                      <AccionesUsuario
                        usuario={usuario}
                        onEditar={handleAbrirEditar}
                        onPassword={handleAbrirPassword}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginacion */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">
              Pagina {paginaActual} de {totalPaginas} &mdash; {usuarios.length} usuarios
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

TablaUsuarios.displayName = "TablaUsuarios";

export default TablaUsuarios;
