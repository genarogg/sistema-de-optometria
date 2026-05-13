import { prisma, verificarToken, successResponse, errorResponse, log } from "@fn";
import { Rol } from "@prisma/client";

interface GetSuscripcionesArgs {
    token: string;
    filtro?: string;
}

const getSuscripciones = async (_: unknown, args: GetSuscripcionesArgs) => {
    log.dev("getSuscripciones called with args:", args);

    const { token, filtro } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        let whereClause: any = {};

        // Si no es SUPER_USUARIO o ADMINISTRADOR, solo ver sus propias suscripciones
        if (usuario.rol !== Rol.SUPER_USUARIO && usuario.rol !== Rol.ADMINISTRADOR) {
            whereClause.usuarioId = usuario.id;
        }

        // Aplicar filtro solo por CI si se proporciona
        if (filtro) {
            whereClause.Usuario = {
                ...whereClause.Usuario,
                cedula: filtro,
            };
        }

        const suscripciones = await prisma.suscripcion.findMany({
            where: whereClause,
            include: {
                usuario: true,
                planSuscripcion: true,
            },
        });

        console.log(suscripciones)

        return successResponse({
            message: "Suscripciones obtenidas correctamente",
            data: suscripciones,
        });
    } catch (error: any) {
        log.error("Error en getSuscripciones:", error);
        return errorResponse({ message: error.message || "Error al obtener suscripciones" });
    }
};

export default getSuscripciones;