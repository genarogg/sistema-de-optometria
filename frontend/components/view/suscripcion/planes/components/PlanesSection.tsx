'use client';

import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from 'lucide-react';
import TablaPlan from './TablaPlan';
import TarjetaPlan from './TarjetaPlan';
import ModalCrearPlan from './ModalCrearPlan';
import PlanesBuscador from './PlanesBuscador';
import { usePlaneFilters } from '../hook/usePlaneFilters';
import { getPlanesService } from '../service/getPlanes.service';
import usePlanesStore from '../store/planesStore';
import { useShallow } from 'zustand/react/shallow';


export default function PlanesSection() {
  const isMobile = useIsMobile()
  const [isPlanModalOpen, setIsPlanModalOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);

  const { planes, cargando, error } = usePlanesStore(
    useShallow((state) => ({
      planes: state.planes,
      cargando: state.cargando,
      error: state.error,
    }))
  );

  const {
    filteredPlanes,
    searchTerm,
    setSearchTerm,
  } = usePlaneFilters(planes);

  useEffect(() => {
    getPlanesService();
  }, []);

  const handleRefresh = async () => {
    await getPlanesService();
  };

  return (
    <div className="flex flex-col gap-4">
      <PlanesBuscador
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClick={() => {
          setSelectedPlan(null);
          setIsPlanModalOpen(true);
        }}
      />

      <div className="flex flex-col gap-4">
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
        ) : filteredPlanes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No se encontraron planes
            </p>
          </div>
        ) : isMobile ? (
          <TarjetaPlan
            planes={filteredPlanes}
            onEdit={(plan) => {
              setSelectedPlan(plan);
              setIsPlanModalOpen(true);
            }}
            onDelete={() => handleRefresh()}
          />
        ) : (
          <TablaPlan
            planes={filteredPlanes}
            onEdit={(plan) => {
              setSelectedPlan(plan);
              setIsPlanModalOpen(true);
            }}
            onDelete={() => handleRefresh()}
          />
        )}
      </div>

      <ModalCrearPlan
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
        onSuccess={() => {
          setSelectedPlan(null);
        }}
      />
    </div>
  );
}
