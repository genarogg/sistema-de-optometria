import {
    successResponse,
    errorResponse,
    prisma,
    verificarToken,
    crearBitacora,
    log
} from "@fn";
import { Prisma, AccionesBitacora, VigenciaEvento } from "@prisma/client";

interface GetEventosActivosArgs {
    token: string;
    page?: number;
    pageSize?: number;
    filtro?: string;
    tipo?: string;
}

const getEventosActivos = async (_: unknown, args: GetEventosActivosArgs) => {
    log.dev("getEventosActivos called with args:", args);

    const { token, page = 1, pageSize = 10, filtro, tipo } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const whereClause: Prisma.EventoWhereInput = {
            vigencia: VigenciaEvento.VIGENTE,
            AND: [],
        };

        const andConditions: Prisma.EventoWhereInput[] = [];

        if (filtro) {
            andConditions.push({
                OR: [
                    { nombre: { contains: filtro, mode: 'insensitive' } },
                    { lugar: { contains: filtro, mode: 'insensitive' } },
                ],
            });
        }

        if (tipo) {
            andConditions.push({ tipo: tipo as any });
        }

        if (andConditions.length > 0) {
            whereClause.AND = andConditions;
        }

        const [eventos, total] = await prisma.$transaction([
            prisma.evento.findMany({
                where: whereClause,
                include: {
                    ponenteEvento: {
                        include: {
                            usuario: true
                        }
                    }
                },
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            prisma.evento.count({ where: whereClause }),
        ]);

        // busca al usuario con sus eventos
        const suscripcionesEventoUsuario = await prisma.suscripcionEvento.findMany({
            where: { usuarioId: usuario.id }
        });

        await crearBitacora({
            type: AccionesBitacora.VIEW,
            usuarioId: usuario.id,
            mensaje: "Se consultaron los eventos activos",
        });

        const data = {
            eventos,
            suscripcionesEventoUsuario
        }

        return successResponse({
            message: "Eventos activos obtenidos correctamente",
            data,
            meta: {
                total: total,
                page: page,
                limit: pageSize,
            }
        });

    } catch (error) {
        console.error(error);
        return errorResponse({ message: "Error al obtener eventos activos" });
    }
};

export default getEventosActivos;
