import { prisma, verificarToken, successResponse, errorResponse, log, crearBitacora } from "@fn";
import { TipoDeDocumento, TipoAutoridad, Rol, AccionesBitacora, TipoEvento } from "@prisma/client";
import crearDocumentoSolicitado from "./fn/crearDocumentoSolicitado";
import { generatePDF } from "@react-pdf-levelup/core";
import CertificadoEvento from "../../../pdf/CertificadoEvento";
import formatFechaCorto from "./fn/formatFechaCorto";

interface GetCertificadoArgs {
    token: string;
    usuarioId?: number;
    eventoId: number;
}

const getCertificado = async (_: unknown, args: GetCertificadoArgs) => {
    log.dev("getCertificado called with args:", args);

    const { token, usuarioId, eventoId } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    if (!eventoId) {
        return errorResponse({ message: "Evento requerido" });
    }

    try {
        const usuarioVerificado = await verificarToken(token);

        if (!usuarioVerificado) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        const usuarioIdToUse = usuarioId || usuarioVerificado.id;

        // Obtener la suscripción del usuario al evento
        const suscripcionEvento = await prisma.suscripcionEvento.findFirst({
            where: {
                usuarioId: usuarioIdToUse,
                eventoId,
            },
            include: {
                usuario: true,
                evento: true,
            },
        });

        if (!suscripcionEvento) {
            return errorResponse({ message: "El usuario no está suscrito a este evento o el evento no existe" });
        }

        const usuario = suscripcionEvento.usuario;
        const evento = suscripcionEvento.evento;

        if (!usuario) {
            return errorResponse({ message: "Usuario no encontrado" });
        }

        if (!evento) {
            return errorResponse({ message: "Evento no encontrado" });
        }

        // Obtener autoridades: presidente, vicepresidente y director de eventos
        const presidente = await prisma.autoridad.findFirst({
            where: { tipoAutoridad: TipoAutoridad.PRESIDENTE, vigente: true },
            orderBy: { id: 'desc' },
            include: { usuario: true },
        });

        const secretarioAcademico = await prisma.autoridad.findFirst({
            where: { tipoAutoridad: TipoAutoridad.SECRETARIO_ACADEMICO, vigente: true },
            orderBy: { id: 'desc' },
            include: { usuario: true },
        });

        if (!presidente) {
            return errorResponse({ message: "No se encontró la autoridad presidente" });
        }

        if (!secretarioAcademico) {
            return errorResponse({ message: "No se encontró la autoridad secretario académico" });
        }

        const documentoSolicitado = await crearDocumentoSolicitado({
            usuarioId: usuario.id,
            autoridadId: presidente.id,
            tipo: evento.tipo === TipoEvento.TALLER
                ? TipoDeDocumento.CERTIFICADO_TALLER
                : evento.tipo === TipoEvento.DIPLOMADO
                    ? TipoDeDocumento.CERTIFICADO_DIPLOMADO
                    : TipoDeDocumento.CERTIFICADO_CONGRESO,
        });

        const CORS_URL = process.env.CORS_URL || "";

        const data = {
            nombreYApellido: `${usuario.primerNombre} ${usuario.primerApellido}`.trim(),
            cedula: usuario.cedula,
            lugarEvento: evento.lugar,
            fechaEvento: formatFechaCorto(evento.fecha),
            urlQR: `${CORS_URL}/estatus/${documentoSolicitado.id}`,
            nombreDelEvento: evento.nombre,
            tipoEvento: evento.tipo,
            rol: usuario.rol,
            autoridades: {
                presidente: {
                    nombreYApellido: `${presidente.usuario.primerNombre} ${presidente.usuario.primerApellido}`.trim(),
                    firmaUrl: presidente.firma
                },
                secretarioAcademico: {
                    nombreYApellido: `${secretarioAcademico.usuario.primerNombre} ${secretarioAcademico.usuario.primerApellido}`.trim(),
                    firmaUrl: secretarioAcademico.firma,
                },
            },
            aliado: {
                institucion: {
                    logoAliado: evento.aliadoInstitucionImg,
                    nombre: evento.aliadoInstitucionNombre,
                },
                autoridad: {
                    nombre: evento.aliadoAutorizoNombreFirma?.trim(),
                    firma: evento.aliadoAutorizoFirmaImg,
                    cargo: evento.aliadoAutorizoCargo
                }
            }

        };

        const documento = await generatePDF({ template: CertificadoEvento, data });

        await crearBitacora({
            usuarioId: usuarioVerificado.id,
            type: evento.tipo === TipoEvento.TALLER
                ? AccionesBitacora.GENERACION_CERTIFICADO_TALLER
                : evento.tipo === TipoEvento.DIPLOMADO
                    ? AccionesBitacora.GENERACION_CERTIFICADO_DIPLOMADO
                    : AccionesBitacora.GENERACION_CERTIFICADO_CONGRESO,
        });

        return successResponse({
            message: "Certificado generado correctamente",
            data: documento,
        });
    } catch (error) {
        console.error("Error al generar certificado:", error);
        return errorResponse({ message: "Error al generar el certificado" });
    }
};

export default getCertificado;
