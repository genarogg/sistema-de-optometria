import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Squeleto } from '@/components/nano'

export function ProfileFormSkeleton() {
    return (
        <div className="p-2 md:p-4 lg:p-6 mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 m-auto max-w-[1200px]">
                <div>
                    <Squeleto width={120} height={32} />
                </div>
            </div>

            <Card className="w-[95vw] max-w-[1200px] bg-white m-auto">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">

                        {/* Foto de perfil skeleton */}
                        <div className="flex flex-col items-center gap-4">
                            <Squeleto width={160} height={160} />
                            <Squeleto width={100} height={16} />
                        </div>

                        {/* Formulario skeleton */}
                        <div className="flex-1 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Primer Nombre */}
                                <div className="space-y-2">
                                    <Squeleto width={120} height={16} />
                                    <Squeleto width="100%" height={40} />
                                </div>

                                {/* Segundo Nombre */}
                                <div className="space-y-2">
                                    <Squeleto width={120} height={16} />
                                    <Squeleto width="100%" height={40} />
                                </div>

                                {/* Primer Apellido */}
                                <div className="space-y-2">
                                    <Squeleto width={100} height={16} />
                                    <Squeleto width="100%" height={40} />
                                </div>

                                {/* Segundo Apellido */}
                                <div className="space-y-2">
                                    <Squeleto width={100} height={16} />
                                    <Squeleto width="100%" height={40} />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Squeleto width={140} height={16} />
                                    <Squeleto width="100%" height={40} />
                                </div>

                                {/* Teléfono */}
                                <div className="space-y-2">
                                    <Squeleto width={90} height={16} />
                                    <Squeleto width="100%" height={40} />
                                </div>

                                {/* Cédula */}
                                <div className="space-y-2">
                                    <Squeleto width={60} height={16} />
                                    <Squeleto width="100%" height={40} />
                                </div>

                                {/* Número de Gremio */}
                                <div className="space-y-2">
                                    <Squeleto width={120} height={16} />
                                    <Squeleto width="100%" height={40} />
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end flex-col sm:flex-row gap-4 pt-4">
                                <Squeleto width={180} height={40} />
                                <Squeleto width={150} height={40} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
