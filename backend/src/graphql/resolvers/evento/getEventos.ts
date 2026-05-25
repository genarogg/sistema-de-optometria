import { 
    successResponse, 
    errorResponse, 
    prisma, 
    verificarToken, 
    crearBitacora, 
    log,
    getPaginacionParams,
    getPaginacionMeta
} from "@fn";
import { Prisma,  AccionesBitacora, VigenciaEvento } from "@prisma/client";

interface GetEventosArgs {
    token: string;
    page?: number;
    pageSize?: number;
    filtro?: string;
    vigencia?: VigenciaEvento;
}

const getEventos = async (_: unknown, args: GetEventosArgs) => {
    log.dev("getEventos called with args:", args);
    
    const { token, page = 1, pageSize = 20, filtro, vigencia } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        const whereClause: Prisma.EventoWhereInput = {};

        if (filtro) {
            const filtroCleaned = filtro.trim();
            whereClause.OR = [
                { nombre: { contains: filtroCleaned } },
                { lugar: { contains: filtroCleaned } },
            ];
        }

        if (vigencia) {
            whereClause.vigencia = vigencia;
        }

        const { skip, take } = getPaginacionParams({ page, pageSize });

        const eventos = await prisma.evento.findMany({
            where: whereClause,
            include: {
                Usuario: true,
                ponente_Evento: {
                    include: {
                        usuario: true
                    }
                },
                suscripcion_Evento: true,
            },
            orderBy: { createdAt: "desc" },
            skip,
            take,
        });

        const total = await prisma.evento.count({ where: whereClause });
        const meta = getPaginacionMeta(total, { page, pageSize });

        await crearBitacora({
            type: AccionesBitacora.VIEW,
            usuarioId: usuario.id,
            mensaje: "Se consultaron los eventos",
        });

        return successResponse({
            message: "Eventos obtenidos correctamente",
            data: eventos,
            meta,
        });

    } catch (error) {
        console.error(error);
        return errorResponse({ message: "Error al obtener eventos" });
    }
};

export default getEventos;
