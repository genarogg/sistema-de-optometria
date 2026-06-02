"use client";

import React, { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Rol } from "@/global/enums";
import BadgeRol from "./BadgeRol";
import ModalEditarUsuario from "./ModalEditarUsuario";
import ModalCambiarPassword from "./ModalCambiarPassword";
import ModalEditarGremio from "./ModalEditarGremio";
import ModalEditarAutoridad from "./ModalEditarAutoridad";
import type { Usuario } from "../store/usuariosStore";
import AccionesUsuario from "./AccionesUsuario";

interface TablaUsuariosProps {
  usuarios: Usuario[];
  rolActual: Rol;
}

const TablaUsuarios: React.FC<TablaUsuariosProps> = React.memo(
  ({ usuarios, rolActual }) => {
    const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
    const [usuarioPassword, setUsuarioPassword] = useState<Usuario | null>(null);
    const [usuarioEditarGremio, setUsuarioEditarGremio] = useState<Usuario | null>(null);
    const [usuarioEditarAutoridad, setUsuarioEditarAutoridad] = useState<Usuario | null>(null);

    const handleAbrirEditar = useCallback((usuario: Usuario) => {
      setUsuarioEditar(usuario);
    }, []);

    const handleAbrirPassword = useCallback((usuario: Usuario) => {
      setUsuarioPassword(usuario);
    }, []);

    const handleAbrirEditarGremio = useCallback((usuario: Usuario) => {
      setUsuarioEditarGremio(usuario);
    }, []);

    const handleAbrirEditarAutoridad = useCallback((usuario: Usuario) => {
      setUsuarioEditarAutoridad(usuario);
    }, []);

    const handleCerrarEditar = useCallback(() => setUsuarioEditar(null), []);
    const handleCerrarPassword = useCallback(() => setUsuarioPassword(null), []);
    const handleCerrarEditarGremio = useCallback(() => setUsuarioEditarGremio(null), []);
    const handleCerrarEditarAutoridad = useCallback(() => setUsuarioEditarAutoridad(null), []);

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
              {usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((usuario, index) => (
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
                        <BadgeRol rol={usuario.rol as Rol} />
                    </TableCell>
                    <TableCell className="flex items-center justify-center">
                      <AccionesUsuario
                        usuario={usuario}
                        onEditar={handleAbrirEditar}
                        onPassword={handleAbrirPassword}
                        onEditarGremio={handleAbrirEditarGremio}
                        onEditarAutoridad={handleAbrirEditarAutoridad}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

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
        {usuarioEditarGremio && (
          <ModalEditarGremio
            usuario={usuarioEditarGremio}
            open={!!usuarioEditarGremio}
            onClose={handleCerrarEditarGremio}
          />
        )}
        {usuarioEditarAutoridad && (
          <ModalEditarAutoridad
            usuario={usuarioEditarAutoridad}
            open={!!usuarioEditarAutoridad}
            onClose={handleCerrarEditarAutoridad}
          />
        )}
      </>
    );
  }
);

TablaUsuarios.displayName = "TablaUsuarios";

export default TablaUsuarios;
