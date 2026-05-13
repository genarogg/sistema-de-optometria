import { prisma, verificarToken, successResponse, errorResponse, log, crearBitacora } from "@fn";
import { Rol, EstatusSuscripcion, AccionesBitacora } from "@prisma/client";

interface UpdateSuscripcionEstatusArgs {
    token: string;
    suscripcionId: number;
    estatus: EstatusSuscripcion;
}

const updateSuscripcionEstatus = async (_: unknown, args: UpdateSuscripcionEstatusArgs) => {
    log.dev("updateSuscripcionEstatus called with args:", args);

    const { token, suscripcionId, estatus } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        if (usuario.rol !== Rol.ADMINISTRADOR && usuario.rol !== Rol.SUPER_USUARIO) {
            return errorResponse({ message: "No tienes permisos para actualizar el estatus de la suscripción" });
        }

        const suscripcion = await prisma.suscripcion.findUnique({ where: { id: suscripcionId } });

        if (!suscripcion) {
            return errorResponse({ message: "Suscripción no encontrada" });
        }

        if (suscripcion.estatus !== EstatusSuscripcion.PENDIENTE) {
            return errorResponse({ message: "Solo se puede actualizar el estatus de suscripciones pendientes" });
        }

        if (estatus === EstatusSuscripcion.PENDIENTE) {
            return errorResponse({ message: "El estatus debe cambiarse a un estado diferente de pendiente" });
        }

        const suscripcionActualizada = await prisma.suscripcion.update({
            where: { id: suscripcionId },
            data: { estatus },
        });

        let bitacoraType;

        if (estatus === EstatusSuscripcion.VALIDADO) {
            bitacoraType = AccionesBitacora.VALIDAR_SUSCRIPCION;
        }

        else if (estatus === EstatusSuscripcion.RECHAZADA) {
            bitacoraType = AccionesBitacora.RECHAZAR_SUSCRIPCION;
        }

        else {
            bitacoraType = AccionesBitacora.VENCIADA_SUSCRIPCION;
        }


        await crearBitacora({
            type: bitacoraType,
            usuarioId: usuario.id,
            mensaje: `Se actualizó el estatus de la suscripción ID ${suscripcionId} a ${estatus}`,
        });

        return successResponse({
            message: "Estatus de suscripción actualizado correctamente",
            data: suscripcionActualizada,
        });
    } catch (error: any) {
        log.error("Error en updateSuscripcionEstatus:", error);
        return errorResponse({ message: error.message || "Error al actualizar el estatus de la suscripción" });
    }
};

export default updateSuscripcionEstatus;
