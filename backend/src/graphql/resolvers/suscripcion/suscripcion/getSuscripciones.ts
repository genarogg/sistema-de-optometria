import { prisma, verificarToken, successResponse, errorResponse, log, } from "@fn";
import { Rol, EstatusSuscripcion } from "@prisma/client";

interface GetSuscripcionesArgs {
    token: string;
    filtro?: string;
    pagina?: number;
    estatus?: EstatusSuscripcion | "todos";
}

const getSuscripciones = async (_: unknown, args: GetSuscripcionesArgs) => {
    log.dev("getSuscripciones called with args:", args);

    const { token, filtro, pagina = 1, estatus } = args;
    const itemsPorPagina = 20;
    const skip = (pagina - 1) * itemsPorPagina;

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

        // Aplicar filtro por CI, nombre o comprobante si se proporciona
        if (filtro) {
            whereClause.OR = [
                {
                    usuario: {
                        cedula: {
                            contains: filtro,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    usuario: {
                        primerNombre: {
                            contains: filtro,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    usuario: {
                        primerApellido: {
                            contains: filtro,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    comprobante: {
                        equals: parseInt(filtro) || undefined,
                    },
                },
            ];
        }

        // Aplicar filtro por estatus
        if (estatus && estatus !== "todos") {
            whereClause.estatus = estatus;
        } else if (!estatus && (usuario.rol === Rol.SUPER_USUARIO || usuario.rol === Rol.ADMINISTRADOR)) {
            // Si no viene estatus y es admin/super usuario, solo mostrar pendientes
            whereClause.estatus = EstatusSuscripcion.PENDIENTE;
        }

        // Obtener el total de suscripciones
        const total = await prisma.suscripcion.count({
            where: whereClause,
        });

        const suscripciones = await prisma.suscripcion.findMany({
            where: whereClause,
            include: {
                usuario: true,
                planSuscripcion: true,
            },
            skip,
            take: itemsPorPagina,
            orderBy: {
                createdAt: "desc",
            },
        });
        console.log(suscripciones)

        return successResponse({
            message: "Suscripciones obtenidas correctamente",
            data: suscripciones,
            meta: {
                total,
                page: pagina,
                limit: itemsPorPagina,
            },
        });
    } catch (error: any) {
        log.error("Error en getSuscripciones:", error);
        return errorResponse({ message: error.message || "Error al obtener suscripciones" });
    }
};

export default getSuscripciones;
