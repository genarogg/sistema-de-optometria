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

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

        const activeEventsWhereClause: Prisma.EventoWhereInput = {
            vigencia: VigenciaEvento.VIGENTE,
            fecha: { gte: today },
        };

        const userSubscriptions = await prisma.suscripcionEvento.findMany({
            where: { usuarioId: usuario.id },
            select: { eventoId: true, estatus: true },
        });

        const subscribedEventIds = userSubscriptions.map(sub => sub.eventoId);

        const pastSubscribedEventsWhereClause: Prisma.EventoWhereInput = {
            id: { in: subscribedEventIds },
            fecha: { lt: today },
        };

        const combinedWhereClause: Prisma.EventoWhereInput = {
            OR: [
                activeEventsWhereClause,
                pastSubscribedEventsWhereClause,
            ],
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
            if (combinedWhereClause.AND) {
                (combinedWhereClause.AND as Prisma.EventoWhereInput[]).push(...andConditions);
            } else {
                combinedWhereClause.AND = andConditions;
            }
        }

        const [eventos, total] = await prisma.$transaction([
            prisma.evento.findMany({
                where: combinedWhereClause,
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
            prisma.evento.count({ where: combinedWhereClause }),
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
