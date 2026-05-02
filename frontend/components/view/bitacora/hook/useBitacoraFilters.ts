"use client";

import { useCallback } from "react";
import { useBitacoraStore } from "../store/bitacoraStore";
import type { AccionesBitacora, FakeRol, Rol } from "../fake/enums";

/**
 * Exposes filter setters used by the toolbar and selectors.
 * All mutations go through the Zustand store so the hook watcher
 * in useGetBitacora picks them up automatically.
 */
export function useBitacoraFilters() {
  const { filters, fakeRol, setFilters, setFakeRol } = useBitacoraStore();

  const handleSearchChange = useCallback(
    (value: string) => {
      setFilters({ searchTerm: value, page: 1 });
    },
    [setFilters]
  );

  const handleRolChange = useCallback(
    (value: Rol | "") => {
      setFilters({ rol: value, page: 1 });
    },
    [setFilters]
  );

  const handleAccionesChange = useCallback(
    (value: AccionesBitacora | "") => {
      setFilters({ acciones: value, page: 1 });
    },
    [setFilters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters({ page });
    },
    [setFilters]
  );

  const handleFakeRolChange = useCallback(
    (value: FakeRol) => {
      setFakeRol(value);
    },
    [setFakeRol]
  );

  return {
    filters,
    fakeRol,
    handleSearchChange,
    handleRolChange,
    handleAccionesChange,
    handlePageChange,
    handleFakeRolChange,
  };
}
