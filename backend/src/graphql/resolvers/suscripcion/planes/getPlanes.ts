import { prisma, verificarToken, successResponse, errorResponse, log } from "@fn";
import { Rol } from "@prisma/client";

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
                suscripcion: true,
            },
        });

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
