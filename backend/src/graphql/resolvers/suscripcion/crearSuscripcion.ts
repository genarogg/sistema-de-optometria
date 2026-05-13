import { prisma, verificarToken, successResponse, errorResponse, log } from "@fn";
import { EstatusSuscripcion } from "@prisma/client";

interface CrearSuscripcionArgs {
    token: string;
    planId: number;
    comprobante: number;
    comprobanteImg: string;
}

const crearSuscripcion = async (_: unknown, args: CrearSuscripcionArgs) => {
    log.dev("crearSuscripcion called with args:", args);

    const { token, planId, comprobante, comprobanteImg } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        const plan = await prisma.planSuscripcion.findUnique({
            where: { id: planId },
            include: {
                suscripcion: true,
            },
        });

        if (!plan) {
            return errorResponse({ message: "Plan de suscripción no encontrado" });
        }

        if (plan.suscripcion) {
            return errorResponse({ message: "Este plan ya tiene una suscripción asociada" });
        }

        const nuevaSuscripcion = await prisma.suscripcion.create({
            data: {
                estatus: EstatusSuscripcion.PENDIENTE,
                comprobante,
                comprobanteImg,
                contodesuscripcion: plan.costo,
                usuarioId: usuario.id,
                suscripcionId: planId,
                isActivo: true,
            },
        });

        return successResponse({
            message: "Suscripción creada correctamente",
            data: nuevaSuscripcion,
        });
    } catch (error: any) {
        log.error("Error en crearSuscripcion:", error);
        return errorResponse({ message: error.message || "Error al crear la suscripción" });
    }
};

export default crearSuscripcion;
