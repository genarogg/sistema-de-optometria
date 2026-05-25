import { prisma, verificarToken, successResponse, errorResponse, log, crearBitacora } from "@fn";
import { Rol, EstatusPagoEvento, AccionesBitacora } from "@prisma/client";

interface ActualizarSuscripcionEventoEstatusArgs {
    token: string;
    suscripcionEventoId: number;
    estatus: EstatusPagoEvento;
}

const actualizarSuscripcionEventoEstatus = async (_: unknown, args: ActualizarSuscripcionEventoEstatusArgs) => {
    log.dev("actualizarSuscripcionEventoEstatus called with args:", args);

    const { token, suscripcionEventoId, estatus } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        if (usuario.rol !== Rol.ADMINISTRADOR && usuario.rol !== Rol.SUPER_USUARIO) {
            return errorResponse({ message: "No tienes permisos para actualizar el estatus de la suscripción de evento" });
        }

        const suscripcionEvento = await prisma.suscripcionEvento.findUnique({ where: { id: suscripcionEventoId } });

        if (!suscripcionEvento) {
            return errorResponse({ message: "Suscripción de evento no encontrada" });
        }

        const suscripcionEventoActualizada = await prisma.suscripcionEvento.update({
            where: { id: suscripcionEventoId },
            data: { estatus },
            include: {
                evento: true,
                usuario: true,
            },
        });

        await crearBitacora({
            type: AccionesBitacora.UPDATE_USER,
            usuarioId: usuario.id,
            mensaje: `Se actualizó el estatus de la suscripción de evento ID ${suscripcionEventoId} a ${estatus}`,
        });

        return successResponse({
            message: "Estatus de suscripción de evento actualizado correctamente",
            data: suscripcionEventoActualizada,
        });
    } catch (error: any) {
        log.error("Error en actualizarSuscripcionEventoEstatus:", error);
        return errorResponse({ message: error.message || "Error al actualizar el estatus de la suscripción de evento" });
    }
};

export default actualizarSuscripcionEventoEstatus;
