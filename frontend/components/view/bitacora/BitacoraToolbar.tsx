"use client";

import React, { memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { AccionesBitacora, FakeRol, Rol } from "./fake/enums";
import { useBitacoraFilters } from "./hook/useBitacoraFilters";


const ALL_ROLES_VALUE = "__all_roles__";
const ALL_ACTIONS_VALUE = "__all_actions__";

const BitacoraToolbar = memo(function BitacoraToolbar() {
  const {
    filters,
    fakeRol,
    handleSearchChange,
    handleRolChange,
    handleAccionesChange,
    handleFakeRolChange,
  } = useBitacoraFilters();

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleSearchChange(e.target.value);
    },
    [handleSearchChange]
  );

  const onRolChange = useCallback(
    (value: string) => {
      handleRolChange(value === ALL_ROLES_VALUE ? "" : (value as Rol));
    },
    [handleRolChange]
  );

  const onAccionesChange = useCallback(
    (value: string) => {
      handleAccionesChange(
        value === ALL_ACTIONS_VALUE ? "" : (value as AccionesBitacora)
      );
    },
    [handleAccionesChange]
  );

  const onFakeRolChange = useCallback(
    (value: string) => {
      handleFakeRolChange(value as FakeRol);
    },
    [handleFakeRolChange]
  );

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-4">
      {/* Search */}
      <div className="relative w-full min-md:max-w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-9"
          placeholder="Buscar por nombre, email o cedula..."
          value={filters.searchTerm}
          onChange={onSearch}
          aria-label="Buscar registros"
        />
      </div>

      {/* Filters Group */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Filter by Rol */}
        <Select
          value={filters.rol || ALL_ROLES_VALUE}
          onValueChange={onRolChange}
        >
          <SelectTrigger className="w-full sm:w-44" aria-label="Filtrar por rol">
            <SelectValue placeholder="Todos los roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ROLES_VALUE}>Todos los roles</SelectItem>
            {Object.values(Rol).map((rol) => (
              <SelectItem key={rol} value={rol}>
                {rol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter by AccionesBitacora */}
        <Select
          value={filters.acciones || ALL_ACTIONS_VALUE}
          onValueChange={onAccionesChange}
        >
          <SelectTrigger
            className="w-full sm:w-52"
            aria-label="Filtrar por acción"
          >
            <SelectValue placeholder="Todas las acciones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ACTIONS_VALUE}>Todas las acciones</SelectItem>
            {Object.values(AccionesBitacora).map((accion) => (
              <SelectItem key={accion} value={accion}>
                {accion.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

export default BitacoraToolbar;
