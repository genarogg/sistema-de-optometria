'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlanesService } from '../../planes/service/getPlanes.service';
import usePlanesStore from '../../planes/store/planesStore';
import { useShallow } from 'zustand/react/shallow';
import { CreditCard } from 'lucide-react';
import ModalSuscribirme from './ModalSuscribirme';
import { TipoSuscripcion } from '@/global/enums';

export default function SuscribirmeSection() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);

  const { planes, cargando } = usePlanesStore(
    useShallow((state) => ({
      planes: state.planes,
      cargando: state.cargando,
    }))
  );

  useEffect(() => {
    getPlanesService();
  }, []);

  const activePlanes = planes.filter((plan: any) => plan.isActivo);

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  if (cargando) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Selecciona un Plan de Suscripción</h2>
        <p className="text-muted-foreground">Elige el plan que mejor se adapte a tus necesidades</p>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activePlanes.map((plan: any) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {plan.tipo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">{plan.costo > 0 ? `Bs ${plan.costo.toFixed(2)}` : 'Sin Costo'}</div>
              <Button 
                className="w-full" 
                onClick={() => handleSelectPlan(plan)}
              >
                Seleccionar Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <ModalSuscribirme
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
      />
    </div>
  );
}
