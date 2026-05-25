import { prisma, verificarToken, successResponse, errorResponse, log, crearBitacora } from "@fn";
import { TipoDeDocumento, TipoAutoridad, Rol, AccionesBitacora } from "@prisma/client";
import crearDocumentoSolicitado from "./fn/crearDocumentoSolicitado";
import { generatePDF } from "@react-pdf-levelup/core";
import CarnetPonente from "@/pdf/CarnetPonente";
import formatFechaCorto from "./fn/formatFechaCorto";

interface GetCarnetEventoArgs {
    token: string;
    usuarioId: number;
    eventoId: number;
}

const getCarnetEvento = async (_: unknown, args: GetCarnetEventoArgs) => {
    log.dev("getCarnetEvento called with args:", args);

    const { token, usuarioId, eventoId } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    if (!usuarioId) {
        return errorResponse({ message: "Usuario requerido" });
    }

    if (!eventoId) {
        return errorResponse({ message: "Evento requerido" });
    }

    try {
        const usuarioVerificado = await verificarToken(token);

        if (!usuarioVerificado) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        const { SUPER_USUARIO, ADMINISTRADOR } = Rol;
        if (usuarioVerificado.rol !== SUPER_USUARIO && usuarioVerificado.rol !== ADMINISTRADOR) {
            return errorResponse({ message: "No tiene permisos para generar el carnet de evento" });
        }

        const ponenteEvento = await prisma.ponenteEvento.findFirst({
            where: {
                usuarioId,
                eventoId,
            },
            include: {
                usuario: true,
                evento: true,
            },
        });

        if (!ponenteEvento) {
            return errorResponse({ message: "El usuario no es ponente de este evento o el evento no existe" });
        }

        const usuario = ponenteEvento.usuario;
        const evento = ponenteEvento.evento;

        if (!usuario) {
            return errorResponse({ message: "Usuario no encontrado" });
        }

        if (!evento) {
            return errorResponse({ message: "Evento no encontrado" });
        }

        const autoridad = await prisma.autoridad.findFirst({
            where: { tipoAutoridad: TipoAutoridad.PRESIDENTE },
            orderBy: { id: 'desc' },
            include: { usuario: true },
        });

        if (!autoridad) {
            return errorResponse({ message: "No se encontró la autoridad" });
        }

        const documentoSolicitado = await crearDocumentoSolicitado({
            usuarioId: usuario.id,
            autoridadId: autoridad.id,
            tipo: TipoDeDocumento.CARNET_PONENTE,
        });

        const CORS_URL = process.env.CORS_URL || "";

        const data = {
            imgAvatar: usuario.avatar || "https://genarogg.github.io/media/genarogg/avatar-placehorder.jpg",
            nombreCompleto: usuario.primerNombre,
            apellidosCompletos: `${usuario.primerApellido} ${usuario.segundoApellido || ""}`,
            cedula: usuario.cedula,
            fechaVencimiento: formatFechaCorto(evento.fecha),
            nombreDelEvento: evento.nombre,
            urlQR: `${CORS_URL}/documento/${documentoSolicitado.id}`,
        };

        const documento = await generatePDF({ template: CarnetPonente, data });

        await crearBitacora({
            usuarioId: usuarioVerificado.id,
            type: AccionesBitacora.GENERACION_CARNET_PONENTE,
        });

        return successResponse({
            message: "Carnet de evento generado correctamente",
            data: documento,
        });
    } catch (error) {
        console.error("Error al generar carnet de evento:", error);
        return errorResponse({ message: "Error al generar el carnet de evento" });
    }
};

export default getCarnetEvento;
