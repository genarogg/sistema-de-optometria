import { prisma, verificarToken, successResponse, errorResponse, log } from "@fn";

interface GetPlanArgs {
    token: string;
    planId: number;
}

const getPlan = async (_: unknown, args: GetPlanArgs) => {
    log.dev("getPlan called with args:", args);

    const { token, planId } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        const plan = await prisma.planSuscripcion.findUnique({
            where: { id: planId }
        });

        if (!plan) {
            return errorResponse({ message: "Plan de suscripción no encontrado" });
        }

        return successResponse({
            message: "Plan de suscripción obtenido correctamente",
            data: plan,
        });
        
    } catch (error: any) {
        log.error("Error en getPlan:", error);
        return errorResponse({ message: error.message || "Error al obtener el plan de suscripción" });
    }
};

export default getPlan;