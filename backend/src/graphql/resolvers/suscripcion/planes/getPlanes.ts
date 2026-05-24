import { prisma, verificarToken, successResponse, errorResponse, log } from "@fn";

interface GetPlanesArgs {
    token: string;
}

const getPlanes = async (_: unknown, args: GetPlanesArgs) => {
    log.dev("getPlanes called with args:", args);

    const { token } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        const planSuscripciones = await prisma.planSuscripcion.findMany({
            include: {
                Usuario: true,
                suscripciones: true,
            },
        });

        console.log("Planes de suscripción obtenidos:", planSuscripciones);

        return successResponse({
            message: "Planes de suscripción obtenidos correctamente",
            data: planSuscripciones,
        });
    } catch (error: any) {
        log.error("Error en getPlanes:", error);
        return errorResponse({ message: error.message || "Error al obtener planes de suscripción" });
    }
};

export default getPlanes;
