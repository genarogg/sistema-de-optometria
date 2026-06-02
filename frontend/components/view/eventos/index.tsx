'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/context/auth/AuthContext';
import { Calendar } from 'lucide-react';
import { Rol } from '@/global/enums';
import AdministrarEventosSection from './administracion';
import SuscripcionesEventoSection from './suscripciones';
import SuscribirmeEventosSection from './suscribirme';

export default function EventosView() {
  const { usuario } = useAuthStore();

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('eventosActiveTab') || 'suscribirme';
    }
    return 'suscribirme';
  });

  const isSuperUsuarioOrAdmin =
    usuario?.rol === Rol.SUPER_USUARIO || usuario?.rol === Rol.ADMINISTRADOR;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eventosActiveTab', activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Card className="w-full shadow-sm max-w-[1500] m-auto mt-4 my-4">
      <CardHeader className="border-b" style={{ paddingBottom: "0px" }}>
        <div className="flex items-center gap-2 text-primary">
          <Calendar className="h-5 w-5" />
          <CardTitle className="text-xl">Eventos</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex w-full">
            <TabsTrigger value="suscribirme">Suscribirme</TabsTrigger>

            {isSuperUsuarioOrAdmin && (
              <TabsTrigger value="suscripciones">Suscripciones de Eventos</TabsTrigger>
            )}
            {isSuperUsuarioOrAdmin && (
              <TabsTrigger value="administracion">Administrar Eventos</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="suscribirme" className="space-y-4 mt-4">
            <SuscribirmeEventosSection />
          </TabsContent>

          {isSuperUsuarioOrAdmin && (
            <TabsContent value="suscripciones" className="mt-4">
              <SuscripcionesEventoSection />
            </TabsContent>
          )}

          {isSuperUsuarioOrAdmin && (
            <TabsContent value="administracion" className="mt-4">
              <AdministrarEventosSection />
            </TabsContent>
          )}


        </Tabs>
      </CardContent>
    </Card>
  );
}
