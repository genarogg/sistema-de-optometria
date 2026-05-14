'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/context/auth/AuthContext';
import PlanesSection from './planes/components/PlanesSection';
import { Rol } from '@/global/enums';

export default function SuscripcionView() {
  const { usuario } = useAuthStore();

  const isSuperUsuarioOrAdmin =
    usuario?.rol === Rol.SUPER_USUARIO || usuario?.rol === Rol.ADMINISTRADOR;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Suscripciones</h1>
        <p className="text-gray-600 mt-2">
          Gestiona tus suscripciones y planes
        </p>
      </div>

      <Tabs defaultValue="suscripciones" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-fit">
          <TabsTrigger value="suscripciones">Mis Suscripciones</TabsTrigger>
          {isSuperUsuarioOrAdmin && (
            <TabsTrigger value="planes">Planes</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="suscripciones" className="space-y-4">
          <div className="text-center py-12">
            <p className="text-gray-500">
              Próximamente: Gestión de tus suscripciones
            </p>
          </div>
        </TabsContent>

        {isSuperUsuarioOrAdmin && (
          <TabsContent value="planes" className="space-y-4">
            <PlanesSection />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
