'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/context/auth/AuthContext';
import { CreditCard } from 'lucide-react';
import PlanesSection from './planes';
import { Rol } from '@/global/enums';
import SuscripcionSection from './suscripciones/components';
import SuscribirmeSection from './suscribirme/components/SuscribirmeSection';

export default function SuscripcionView() {
  const { usuario } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('suscripcionActiveTab') || 'suscribirme';
    }
    return 'suscribirme';
  });

  const isSuperUsuarioOrAdmin =
    usuario?.rol === Rol.SUPER_USUARIO || usuario?.rol === Rol.ADMINISTRADOR;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('suscripcionActiveTab', activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Card className="w-full shadow-sm max-w-[1500] m-auto mt-4 mb-4">
      <CardHeader className="border-b" style={{ paddingBottom: "0px" }}>
        <div className="flex items-center gap-2 text-primary">
          <CreditCard className="h-5 w-5" />
          <CardTitle className="text-xl">Suscripciones</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex w-full overflow-x-auto whitespace-nowrap justify-start">
            <TabsTrigger value="suscripciones">Suscripciones</TabsTrigger>
            <TabsTrigger value="suscribirme">Suscribirme</TabsTrigger>
            {isSuperUsuarioOrAdmin && (
              <TabsTrigger value="planes">Planes</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="suscripciones" className="space-y-4 mt-4">
            <SuscripcionSection 
              setActiveTab={setActiveTab} 
              activeTab={activeTab}
            />
          </TabsContent>

          <TabsContent value="suscribirme" className="space-y-4 mt-4">
            <SuscribirmeSection onSubscriptionSuccess={() => setActiveTab('suscripciones')} />
          </TabsContent>

          {isSuperUsuarioOrAdmin && (
            <TabsContent value="planes" className="mt-4">
              <PlanesSection />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
