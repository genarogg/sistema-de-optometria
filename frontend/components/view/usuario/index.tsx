"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, AlertCircle } from "lucide-react";
import useUsuariosStore from "./store/usuariosStore";
import { getUsuariosService } from "./service/getUsuarios.service";
import { Rol } from "@/global/enums";
import BuscadorUsuarios from "./components/BuscadorUsuarios";
import TablaUsuarios from "./components/TablaUsuarios";
import TarjetaUsuario from "./components/TarjetaUsuario";
import { useIsMobile } from "@/hooks/use-mobile";
import { isProd } from "@/env";

const UsuariosView: React.FC = () => {
  const usuarios = useUsuariosStore((s) => s.usuarios);
  const rolActual = useUsuariosStore((s) => s.rolActual);
  const cargando = useUsuariosStore((s) => s.cargando);
  const error = useUsuariosStore((s) => s.error);
  const paginaActual = useUsuariosStore((s) => s.paginaActual);
  const itemsPorPagina = useUsuariosStore((s) => s.itemsPorPagina);
  const setRolActual = useUsuariosStore((s) => s.setRolActual);
  const setPaginaActual = useUsuariosStore((s) => s.setPaginaActual);

  const isMobile = useIsMobile();

  // Mostrar selector de rol: en produccion solo ADMIN, en desarrollo siempre
  const mostrarSelectorRol = !isProd || rolActual === Rol.ADMIN;

  useEffect(() => {
    getUsuariosService({});
  }, []);

  const handleRolChange = useCallback(
    (value: string) => {
      setRolActual(value as Rol);
      setPaginaActual(1);
    },
    [setRolActual, setPaginaActual]
  );

  const handlePaginaChange = useCallback(
    (pagina: number) => {
      setPaginaActual(pagina);
    },
    [setPaginaActual]
  );

  // Roles que el usuario actual puede ver/seleccionar
  const rolesSeleccionables = useMemo(() => {
    switch (rolActual) {
      case Rol.ADMIN:
        return Object.values(Rol);
      case Rol.ASISTENTE:
        return [Rol.ASISTENTE, Rol.CLIENTE];
      default:
        return [rolActual];
    }
  }, [rolActual]);

  // Filtrado por rol en el cliente: el ADMIN ve todos, otros roles solo ven su propio nivel
  const usuariosFiltradosPorRol = useMemo(() => {
    if (rolActual === Rol.ADMIN) return usuarios;
    return usuarios.filter((u) => u.rol === Rol.CLIENTE);
  }, [usuarios, rolActual]);

  return (
    <Card className="w-full shadow-sm max-w-[1200] m-auto mt-4">
      <CardHeader className="border-b" style={{ paddingBottom: "0px" }} >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Titulo */}
          <div className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5  " />
            <CardTitle className="text-xl ">Usuarios</CardTitle>
            {!cargando && (
              <span className="text-sm  font-normal">
                ({usuariosFiltradosPorRol.length})
              </span>
            )}
          </div>

          {/* Selector de rol */}
          {mostrarSelectorRol && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground shrink-0">Ver como:</span>
              <Select value={rolActual} onValueChange={handleRolChange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Selecciona rol" />
                </SelectTrigger>
                <SelectContent>
                  {rolesSeleccionables.map((rol) => (
                    <SelectItem key={rol} value={rol}>
                      {rol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Buscador */}

      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="pt-2">
          <BuscadorUsuarios />
        </div>

        {/* Estado de error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Estado de carga */}
        {cargando ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : isMobile ? (
          <TarjetaUsuario
            usuarios={usuariosFiltradosPorRol}
            rolActual={rolActual}
            paginaActual={paginaActual}
            itemsPorPagina={itemsPorPagina}
            onPaginaChange={handlePaginaChange}
          />
        ) : (
          <TablaUsuarios
            usuarios={usuariosFiltradosPorRol}
            rolActual={rolActual}
            paginaActual={paginaActual}
            itemsPorPagina={itemsPorPagina}
            onPaginaChange={handlePaginaChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UsuariosView;
