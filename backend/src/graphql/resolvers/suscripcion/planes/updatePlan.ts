import { prisma, verificarToken, successResponse, errorResponse, log, crearBitacora } from "@fn";
import { decimalToInt, montoNoNegativo } from "@fn/money";
import { Rol, AccionesBitacora, TipoSuscripcion } from "@prisma/client";

interface UpdatePlanArgs {
    token: string;
    planId: number;
    costo?: number;
    tipo?: TipoSuscripcion;
    isActivo?: boolean;
}

const updatePlan = async (_: unknown, args: UpdatePlanArgs) => {
    log.dev("updatePlan called with args:", args);

    const { token, planId, costo, tipo, isActivo } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        if (usuario.rol !== Rol.SUPER_USUARIO) {
            return errorResponse({ message: "No tienes permisos para realizar esta accion" });
        }

        // Verificar que el plan existe
        const existingPlan = await prisma.planSuscripcion.findUnique({ where: { id: planId } });

        if (!existingPlan) {
            return errorResponse({ message: "Plan de suscripción no encontrado" });
        }

        const dataToUpdate: any = {};

        if (costo !== undefined) {
            const montoValidation = montoNoNegativo(costo);
            if (!montoValidation.isValido) {
                return errorResponse({ message: montoValidation.message });
            }
            dataToUpdate.costo = decimalToInt(costo);
        }

        dataToUpdate.tipo = tipo;
        dataToUpdate.isActivo = isActivo;

        const filteredData = Object.fromEntries(
            Object.entries(dataToUpdate).filter(([_, value]) => value !== undefined)
        );

        if (Object.keys(filteredData).length === 0) {
            return errorResponse({ message: "No se proporcionaron campos para actualizar" });
        }

        const planActualizado = await prisma.planSuscripcion.update({
            where: { id: planId },
            data: filteredData,
        });

        // Registrar en bitácora
        await crearBitacora({
            type: AccionesBitacora.UPDATE_PLAN_SUSCRIPCION,
            usuarioId: usuario.id,
            mensaje: `Se actualizó el plan de suscripción ID ${planId}`,
        });

        console.log("Plan de suscripción actualizado:", planActualizado);

        return successResponse({
            message: "Plan de suscripción actualizado exitosamente",
            data: planActualizado,
        });
    } catch (error: any) {
        log.error("Error en updatePlan:", error);
        return errorResponse({ message: error.message || "Error al actualizar el plan de suscripción" });
    }
};

export default updatePlan;