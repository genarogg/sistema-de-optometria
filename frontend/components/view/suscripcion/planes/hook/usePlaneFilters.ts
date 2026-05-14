import { useState, useMemo } from 'react';


export interface PlaneFilters {
  searchTerm: string;
}

export function usePlaneFilters(planes: any) {
  const [filters, setFilters] = useState<PlaneFilters>({
    searchTerm: '',
  });

  const filteredPlanes = useMemo(() => {
    return planes.filter((plan: any) => {
      return (
        plan.tipo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        plan.id.toString().includes(filters.searchTerm)
      );
    });
  }, [planes, filters]);

  return {
    filters,
    setFilters,
    filteredPlanes,
    searchTerm: filters.searchTerm,
    setSearchTerm: (term: string) =>
      setFilters((prev) => ({ ...prev, searchTerm: term })),
  };
}
