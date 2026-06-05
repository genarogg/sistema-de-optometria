import { prisma, verificarToken, successResponse, errorResponse, log, crearBitacora } from "@fn";
import { Rol, AccionesBitacora, EstatusPagoEvento, VigenciaEvento } from "@prisma/client";

interface SuscribirseEventoArgs {
    token: string;
    eventoId: number;
    comprobante: string;
    comprobanteImg: string;
}

const suscribirseEvento = async (_: unknown, args: SuscribirseEventoArgs) => {
    log.dev("suscribirseEvento called with args:", args);

    const { token, eventoId, comprobante, comprobanteImg } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    if (!eventoId || !comprobante || !comprobanteImg) {
        return errorResponse({ message: "Todos los campos obligatorios deben ser proporcionados" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        const evento = await prisma.evento.findUnique({ where: { id: eventoId } });

        if (!evento) {
            return errorResponse({ message: "Evento no encontrado" });
        }

        if (evento.vigencia !== VigenciaEvento.VIGENTE) {
            return errorResponse({ message: "El evento no está activo" });
        }

        const suscripcionExistente = await prisma.suscripcionEvento.findFirst({
            where: { 
                usuarioId: usuario.id, 
                eventoId,
            }
        });

        if (suscripcionExistente && suscripcionExistente.estatus !== EstatusPagoEvento.RECHAZADO ) {
            return errorResponse({ message: "Ya estás suscrito a este evento" });
        }

        let descuento = 0;
        if (usuario.rol === Rol.ESTUDIANTE) {
            descuento = evento.descuentoEstudiante;
        } else if (usuario.rol === Rol.PROFESOR) {
            descuento = evento.descuentoProfesor;
        } else if (usuario.rol === Rol.AGREMIADO_SOLVENTE) {
            descuento = 50;
        }

        const precioAlSuscripcion = Math.round(evento.costo * (1 - descuento / 100));

        const nuevaSuscripcion = await prisma.suscripcionEvento.create({
            data: {
                eventoId,
                usuarioId: usuario.id,
                precioAlSuscripcion,
                comprobante,
                comprobanteImg,
                estatus: EstatusPagoEvento.PENDIENTE,
            },
            include: {
                evento: true,
                usuario: true,
            },
        });

        await crearBitacora({
            type: AccionesBitacora.USUARIO_AGG_AL_EVENTO,
            usuarioId: usuario.id,
            mensaje: `El usuario se suscribió al evento "${evento.nombre}"`,
        });

        return successResponse({
            message: "Suscripción al evento realizada exitosamente",
            data: nuevaSuscripcion,
        });
    } catch (error: any) {
        log.error("Error en suscribirseEvento:", error);
        return errorResponse({ message: error.message || "Error al suscribirse al evento" });
    }
};

export default suscribirseEvento;
