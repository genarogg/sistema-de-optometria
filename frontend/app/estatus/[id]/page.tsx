'use client';

import React, { useState, useEffect } from 'react';
import { URL_BACKEND } from '@/env';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, User, FileText, Calendar, Award, ShieldCheck, CreditCard } from 'lucide-react';

// Función para formatear tipo de documento
const getDocumentoNombre = (tipo: string) => {
    switch (tipo) {
        case 'CERTIFICADO_TALLER': return 'Certificado de Taller';
        case 'CERTIFICADO_DIPLOMADO': return 'Certificado de Diplomado';
        case 'CERTIFICADO_CONGRESO': return 'Certificado de Congreso';
        case 'CARNET': return 'Carnet de Miembro';
        case 'CARNET_PONENTE': return 'Carnet de Ponente';
        case 'SOLVENCIA_PAGO': return 'Solvencia de Pago';
        case 'COMPROBANTE_PAGO': return 'Comprobante de Pago';
        default: return 'Documento';
    }
};

// Función para obtener ícono según tipo de documento
const getDocumentoIcono = (tipo: string) => {
    switch (tipo) {
        case 'CERTIFICADO_TALLER':
        case 'CERTIFICADO_DIPLOMADO':
        case 'CERTIFICADO_CONGRESO':
            return <Award className="w-12 h-12 text-amber-600" />;
        case 'CARNET':
        case 'CARNET_PONENTE':
            return <CreditCard className="w-12 h-12 text-blue-600" />;
        case 'SOLVENCIA_PAGO':
            return <ShieldCheck className="w-12 h-12 text-green-600" />;
        case 'COMPROBANTE_PAGO':
            return <FileText className="w-12 h-12 text-purple-600" />;
        default:
            return <FileText className="w-12 h-12 text-gray-600" />;
    }
};

export default function EstatusDocumentoPage({ params }: { params: { id: string } }) {
    const documentoId = parseInt(params.id);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [documento, setDocumento] = useState<any>(null);

    useEffect(() => {
        const fetchDocumento = async () => {
            try {
                const response = await fetch(`${URL_BACKEND}/graphql`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            query GetValidacionDocumento($id: Int!) {
                                validacionDocumento(id: $id) {
                                    message
                                    type
                                    data
                                }
                            }
                        `,
                        variables: { id: documentoId },
                    }),
                });

                const result = await response.json();
                
                if (result.errors) {
                    setError(result.errors[0].message);
                    setLoading(false);
                    return;
                }

                const validacionData = result.data.validacionDocumento;
                
                if (validacionData.type === 'error') {
                    setError(validacionData.message);
                    setLoading(false);
                    return;
                }

                try {
                    const parsedData = JSON.parse(validacionData.data);
                    setDocumento(parsedData);
                } catch (e) {
                    setError('Error al procesar la información del documento');
                }
            } catch (err: any) {
                setError(err.message || 'Error al consultar el documento');
            } finally {
                setLoading(false);
            }
        };

        fetchDocumento();
    }, [documentoId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando documento...</p>
                </div>
            </div>
        );
    }

    if (error || !documento) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
                <Card className="max-w-md w-full shadow-xl">
                    <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="w-16 h-16 text-red-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-red-700">Documento No Válido</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-600">
                            {error || 'El documento no existe o no es válido. Por favor verifica el ID.'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const usuario = documento.usuario;
    const nombreCompleto = `${usuario.primerNombre} ${usuario.primerApellido} ${usuario.segundoApellido || ''}`.trim();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Card className="shadow-2xl border-t-4 border-blue-600">
                    {/* Encabezado con logo */}
                    <CardHeader className="text-center pb-2 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex justify-center mb-4">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                                {/* Logo placeholder - puede reemplazarse con la imagen del colegio */}
                                <div className="text-blue-600 font-bold text-xl">COV</div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                            Colegio de Optometristas de Venezuela
                        </p>
                    </CardHeader>

                    {/* Estado de verificación */}
                    <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                        <div className="flex items-center justify-center gap-3">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-green-800 font-semibold text-lg">Documento Válido</p>
                                <p className="text-green-600 text-sm">Este documento ha sido verificado oficialmente</p>
                            </div>
                        </div>
                    </div>

                    {/* Información del documento */}
                    <CardContent className="pt-6">
                        <div className="mb-8 text-center">
                            <div className="flex justify-center mb-4">
                                {getDocumentoIcono(documento.tipo)}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {getDocumentoNombre(documento.tipo)}
                            </h2>
                            <Badge variant="outline" className="text-sm bg-blue-100 text-blue-800 border-blue-200">
                                ID: {documento.id}
                            </Badge>
                        </div>

                        {/* Datos del usuario */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Datos del Titular
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Nombre Completo</p>
                                    <p className="text-gray-800 font-medium">{nombreCompleto}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Cédula de Identidad</p>
                                    <p className="text-gray-800 font-medium">{usuario.cedula}</p>
                                </div>
                            </div>
                        </div>

                        {/* Información adicional */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    Fecha de emisión: {new Date(documento.createdAt).toLocaleDateString('es-VE', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </CardContent>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t text-center text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} Colegio de Optometristas de Venezuela. Todos los derechos reservados.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
