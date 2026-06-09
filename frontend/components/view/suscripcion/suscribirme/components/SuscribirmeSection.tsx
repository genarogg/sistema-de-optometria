'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlanesService } from '../../planes/service/getPlanes.service';
import usePlanesStore from '../../planes/store/planesStore';
import { useShallow } from 'zustand/react/shallow';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import ModalSuscribirme from './ModalSuscribirme';
import { TipoSuscripcion, Rol } from '@/global/enums';
import { showMoney } from 'supermoney';
import { useAuthStore } from '@/context/auth/AuthContext';

interface SuscribirmeSectionProps {
  onSubscriptionSuccess?: () => void;
}

export default function SuscribirmeSection({ onSubscriptionSuccess }: SuscribirmeSectionProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);

  const { planes, cargando } = usePlanesStore(
    useShallow((state) => ({
      planes: state.planes,
      cargando: state.cargando,
    }))
  );

  const { usuario } = useAuthStore();
  const userRol = usuario?.rol as Rol;

  useEffect(() => {
    getPlanesService();
  }, []);

  const activePlanes = planes.filter((plan: any) => plan.isActivo);

  const getPlanStatus = (planTipo: string) => {
    if (!userRol) return null;
    
    // Si es AGREMIADO_INSOLVENTE
    if (userRol === Rol.AGREMIADO_INSOLVENTE) {
      return planTipo === TipoSuscripcion.AGREMIADO ? { text: 'Debe renovarse', icon: AlertCircle, color: 'text-yellow-600' } : null;
    }
    // Si es SUPER_USUARIO, ADMINISTRADOR o AGREMIADO_SOLVENTE → plan agremiado es el actual
    if ([Rol.SUPER_USUARIO, Rol.ADMINISTRADOR, Rol.AGREMIADO_SOLVENTE].includes(userRol)) {
      return planTipo === TipoSuscripcion.AGREMIADO ? { text: 'Plan Actual', icon: CheckCircle, color: 'text-green-600' } : null;
    }
    // Para PROFESOR, ESTUDIANTE, VISITANTE → marcar el plan correspondiente como actual
    if (planTipo === userRol) {
      return { text: 'Plan Actual', icon: CheckCircle, color: 'text-green-600' };
    }
    return null;
  };

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
        {activePlanes.map((plan: any) => {
          const planStatus = getPlanStatus(plan.tipo);
          return (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {plan.tipo}
                </CardTitle>
                {planStatus && (
                  <div className={`flex items-center gap-1 p-1.5 rounded-md ${planStatus.color === 'text-yellow-600' ? 'bg-yellow-50' : 'bg-green-50'}`}>
                    <planStatus.icon className={`h-4 w-4 ${planStatus.color}`} />
                    <span className={`text-sm font-medium ${planStatus.color}`}>{planStatus.text}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-primary">{plan.costo > 0 ? `Bs ${showMoney(plan.costo)}` : 'Sin Costo'}</div>
                <Button
                  className="w-full"
                  onClick={() => handleSelectPlan(plan)}
                >
                  Seleccionar Plan
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ModalSuscribirme
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
        onSubscriptionSuccess={onSubscriptionSuccess}
      />
    </div>
  );
}
