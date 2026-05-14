'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreditCard } from 'lucide-react';
import TablaPlan from './TablaPlan';
import TarjetaPlan from './TarjetaPlan';
import ModalCrearPlan from './ModalCrearPlan';
import PlanesBuscador from './PlanesBuscador';
import { usePlaneFilters } from '../hook/usePlaneFilters';
import { getPlanesService } from '../service/getPlanes.service';
import planesStore from '../store/planesStore';
import { useShallow } from 'zustand/react/shallow';


export default function PlanesSection() {
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const { planes, setPlanes } = planesStore(
    useShallow((state) => ({
      planes: state.planes,
      setPlanes: state.setPlanes,
    }))
  );

  const {
    filteredPlanes,
    searchTerm,
    setSearchTerm,
  } = usePlaneFilters(planes);

  useEffect(() => {
    const loadPlanes = async () => {
      setIsLoading(true);
      try {
        await getPlanesService();
      } catch (error) {
        console.error('[v0] Error loading planes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlanes();
  }, [setPlanes]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await getPlanesService();
    } catch (error) {
      console.error('[v0] Error refreshing planes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-sm max-w-[1200] m-auto">
      <CardHeader className="border-b" style={{ paddingBottom: "0px" }}>
        <div className="flex items-center gap-2 text-primary">
          <CreditCard className="h-5 w-5" />
          <CardTitle className="text-xl">Planes</CardTitle>
          {!isLoading && (
            <span className="text-sm font-normal">
              ({filteredPlanes.length})
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="pt-2">
          <PlanesBuscador
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onCreateClick={() => {
              setSelectedPlan(null);
              setIsPlanModalOpen(true);
            }}
          />
        </div>

        {isMobile ? (
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
      </CardContent>

      <ModalCrearPlan
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
        onSuccess={() => {
          handleRefresh();
          setSelectedPlan(null);
        }}
      />
    </Card>
  );
}
