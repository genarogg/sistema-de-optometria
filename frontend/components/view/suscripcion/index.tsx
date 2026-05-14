'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/context/auth/AuthContext';
import { CreditCard } from 'lucide-react';
import PlanesSection from './planes/components/PlanesSection';
import { Rol } from '@/global/enums';
import SuscripcionSection from './suscripcion/components/SuscripcionSection';

export default function SuscripcionView() {
  const { usuario } = useAuthStore();

  const isSuperUsuarioOrAdmin =
    usuario?.rol === Rol.SUPER_USUARIO || usuario?.rol === Rol.ADMINISTRADOR;

  return (
    <Card className="w-full shadow-sm max-w-[1500] m-auto mt-4">
      <CardHeader className="border-b" style={{ paddingBottom: "0px" }}>
        <div className="flex items-center gap-2 text-primary">
          <CreditCard className="h-5 w-5" />
          <CardTitle className="text-xl">Suscripciones</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-4">
        <Tabs defaultValue="suscripciones" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suscripciones">Suscripciones</TabsTrigger>
            {isSuperUsuarioOrAdmin && (
              <TabsTrigger value="planes">Planes</TabsTrigger>
            )}
          </TabsList>

         <TabsContent value="suscripciones" className="space-y-4 mt-4">
            <SuscripcionSection />
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
