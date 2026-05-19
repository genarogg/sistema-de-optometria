"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rol } from "@/global/enums";
import ModalEditarUsuario from "./ModalEditarUsuario";
import ModalCambiarPassword from "./ModalCambiarPassword";
import ModalEditarGremio from "./ModalEditarGremio";
import ModalEditarAutoridad from "./ModalEditarAutoridad";
import type { Usuario } from "../store/usuariosStore";
import AccionesUsuario from "./AccionesUsuario";

interface TarjetaUsuarioProps {
  usuarios: Usuario[];
  rolActual: Rol;
}

const TarjetaUsuario: React.FC<TarjetaUsuarioProps> = React.memo(
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
        <div className="flex flex-col gap-3">
          {usuarios.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground text-sm">
              No se encontraron usuarios.
            </p>
          ) : (
            usuarios.map((usuario) => (
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
                      onEditarGremio={handleAbrirEditarGremio}
                      onEditarAutoridad={handleAbrirEditarAutoridad}
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
            )))}
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

TarjetaUsuario.displayName = "TarjetaUsuario";

export default TarjetaUsuario;
