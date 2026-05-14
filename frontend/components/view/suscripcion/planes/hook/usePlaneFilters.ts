import { useState, useMemo } from 'react';


export interface PlaneFilters {
  searchTerm: string;
  statusFilter: string;
}

export function usePlaneFilters(planes: any) {
  const [filters, setFilters] = useState<PlaneFilters>({
    searchTerm: '',
    statusFilter: 'todos',
  });

  const filteredPlanes = useMemo(() => {
    return planes.filter((plan: any) => {
      const matchesSearch =
        plan.tipo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        plan.id.toString().includes(filters.searchTerm);

      const matchesStatus =
        filters.statusFilter === 'todos' ||
        (filters.statusFilter === 'activo' && plan.isActivo) ||
        (filters.statusFilter === 'inactivo' && !plan.isActivo);

      return matchesSearch && matchesStatus;
    });
  }, [planes, filters]);

  return {
    filters,
    setFilters,
    filteredPlanes,
    searchTerm: filters.searchTerm,
    setSearchTerm: (term: string) =>
      setFilters((prev) => ({ ...prev, searchTerm: term })),
    statusFilter: filters.statusFilter,
    setStatusFilter: (status: string) =>
      setFilters((prev) => ({ ...prev, statusFilter: status })),
  };
}
