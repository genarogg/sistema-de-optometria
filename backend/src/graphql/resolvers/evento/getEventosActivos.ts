import { 
    successResponse, 
    errorResponse, 
    prisma, 
    verificarToken, 
    crearBitacora, 
    log
} from "@fn";
import { Prisma, AccionesBitacora, VigenciaEvento, TipoEvento } from "@prisma/client";

interface GetEventosActivosArgs {
    token: string;
    filtro?: string;
    tipo?: TipoEvento;
}

const getEventosActivos = async (_: unknown, args: GetEventosActivosArgs) => {
    log.dev("getEventosActivos called with args:", args);
    
    const { token, filtro, tipo } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        const whereClause: Prisma.EventoWhereInput = {
            vigencia: VigenciaEvento.VIGENTE
        };

        if (filtro) {
            const filtroCleaned = filtro.trim();
            whereClause.OR = [
                { nombre: { contains: filtroCleaned } },
                { lugar: { contains: filtroCleaned } },
            ];
        }

        if (tipo) {
            whereClause.tipo = tipo;
        }

        const eventos = await prisma.evento.findMany({
            where: whereClause,
            include: {
                ponenteEvento: {
                    include: {
                        usuario: true
                    }
                },
                suscripcionEvento: true,
            },
            orderBy: { createdAt: "desc" },
        });

        await crearBitacora({
            type: AccionesBitacora.VIEW,
            usuarioId: usuario.id,
            mensaje: "Se consultaron los eventos activos",
        });

        return successResponse({
            message: "Eventos activos obtenidos correctamente",
            data: eventos,
        });

    } catch (error) {
        console.error(error);
        return errorResponse({ message: "Error al obtener eventos activos" });
    }
};

export default getEventosActivos;
